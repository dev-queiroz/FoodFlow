<template>
  <div class="dashboard-layout">
    <SidebarMenu />
    <div class="dashboard-content">
      <!-- Header da página -->
      <div class="page-header">
        <h1>Painel da Cozinha</h1>
        <div class="header-stats">
          <div class="stat-card">
            <div class="stat-number">{{ orders.filter(o => o.status === 'pending').length }}</div>
            <div class="stat-label">Pendentes</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ orders.filter(o => o.status === 'preparing').length }}</div>
            <div class="stat-label">Em Preparo</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ orders.filter(o => o.status === 'ready').length }}</div>
            <div class="stat-label">Prontos</div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters">
        <div class="filter-tabs">
          <button 
            class="filter-tab" 
            :class="{ active: activeFilter === 'all' }"
            @click="activeFilter = 'all'"
          >
            <i class="fas fa-list"></i>
            Todos ({{ filteredOrders.length }})
          </button>
          <button 
            class="filter-tab" 
            :class="{ active: activeFilter === 'pending' }"
            @click="activeFilter = 'pending'"
          >
            <i class="fas fa-clock"></i>
            Pendentes ({{ orders.filter(o => o.status === 'pending').length }})
          </button>
          <button 
            class="filter-tab" 
            :class="{ active: activeFilter === 'preparing' }"
            @click="activeFilter = 'preparing'"
          >
            <i class="fas fa-fire"></i>
            Em Preparo ({{ orders.filter(o => o.status === 'preparing').length }})
          </button>
          <button 
            class="filter-tab" 
            :class="{ active: activeFilter === 'ready' }"
            @click="activeFilter = 'ready'"
          >
            <i class="fas fa-check-circle"></i>
            Prontos ({{ orders.filter(o => o.status === 'ready').length }})
          </button>
        </div>
        
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Buscar por mesa ou pedido..." 
            v-model="searchTerm"
          >
        </div>
      </div>

      <!-- Lista de Pedidos -->
      <div class="orders-grid">
        <div 
          v-for="order in filteredOrders" 
          :key="order.id" 
          class="order-card"
          :class="[`status-${order.status}`, { 'urgent': isUrgent(order) }]"
        >
          <!-- Header do pedido -->
          <div class="order-header">
            <div class="order-info">
              <h3>#{{ order.number }}</h3>
              <div class="order-meta">
                <span class="table">Mesa {{ order.table }}</span>
                <span class="time">{{ formatTime(order.createdAt) }}</span>
                <span class="priority" v-if="isUrgent(order)">🔥 URGENTE</span>
              </div>
            </div>
            <div class="order-status">
              <select 
                v-model="order.status" 
                @change="updateOrderStatus(order)"
                class="status-select"
                :class="`status-${order.status}`"
              >
                <option value="pending">Pendente</option>
                <option value="preparing">Em Preparo</option>
                <option value="ready">Pronto</option>
                <option value="delivered">Entregue</option>
              </select>
            </div>
          </div>

          <!-- Itens do pedido -->
          <div class="order-items">
            <div 
              v-for="item in order.items" 
              :key="item.id"
              class="order-item"
            >
              <div class="item-info">
                <div class="item-header">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-quantity">x{{ item.quantity }}</span>
                </div>
                <div class="item-details" v-if="item.notes || item.modifications">
                  <p v-if="item.notes" class="item-notes">
                    <i class="fas fa-sticky-note"></i>
                    {{ item.notes }}
                  </p>
                  <div v-if="item.modifications" class="item-modifications">
                    <i class="fas fa-edit"></i>
                    <span v-for="mod in item.modifications" :key="mod" class="modification">
                      {{ mod }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="item-actions">
                <button 
                  class="btn-icon"
                  :class="{ completed: item.completed }"
                  @click="toggleItemCompleted(order, item)"
                  :title="item.completed ? 'Marcar como pendente' : 'Marcar como concluído'"
                >
                  <i class="fas" :class="item.completed ? 'fa-check-circle' : 'fa-circle'"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Footer do pedido -->
          <div class="order-footer">
            <div class="order-timing">
              <span class="elapsed-time">{{ getElapsedTime(order.createdAt) }}</span>
              <span class="estimated-time" v-if="order.estimatedTime">
                Estimativa: {{ order.estimatedTime }}min
              </span>
            </div>
            <div class="order-actions">
              <button 
                v-if="order.status === 'pending'" 
                class="btn btn-primary"
                @click="startPreparing(order)"
              >
                <i class="fas fa-play"></i>
                Iniciar
              </button>
              <button 
                v-if="order.status === 'preparing'" 
                class="btn btn-success"
                @click="markAsReady(order)"
                :disabled="!allItemsCompleted(order)"
              >
                <i class="fas fa-check"></i>
                Marcar como Pronto
              </button>
              <button 
                v-if="order.status === 'ready'" 
                class="btn btn-outline"
                @click="markAsDelivered(order)"
              >
                <i class="fas fa-truck"></i>
                Entregue
              </button>
            </div>
          </div>
        </div>

        <!-- Estado vazio -->
        <div v-if="filteredOrders.length === 0" class="empty-state">
          <i class="fas fa-utensils"></i>
          <h3>Nenhum pedido encontrado</h3>
          <p>{{ getEmptyStateMessage() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import SidebarMenu from '@/components/dashboard/SidebarMenu.vue';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  modifications?: string[];
  completed: boolean;
}

interface Order {
  id: string;
  number: string;
  table: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  createdAt: Date;
  estimatedTime?: number;
  items: OrderItem[];
  waiter: string;
}

export default defineComponent({
  name: 'KitchenDashboard',
  components: {
    SidebarMenu
  },
  setup() {
    const activeFilter = ref<string>('all');
    const searchTerm = ref('');

    // Dados mock
    const orders = ref<Order[]>([
      {
        id: '1',
        number: '001',
        table: 5,
        status: 'pending',
        createdAt: new Date(Date.now() - 5 * 60000), // 5 minutos atrás
        estimatedTime: 25,
        waiter: 'João Silva',
        items: [
          {
            id: '1-1',
            name: 'Salmão Grelhado',
            quantity: 2,
            notes: 'Mal passado',
            modifications: ['Sem cebola', 'Molho à parte'],
            completed: false
          },
          {
            id: '1-2',
            name: 'Bruschetta Italiana',
            quantity: 1,
            completed: false
          }
        ]
      },
      {
        id: '2',
        number: '002',
        table: 3,
        status: 'preparing',
        createdAt: new Date(Date.now() - 15 * 60000), // 15 minutos atrás
        estimatedTime: 20,
        waiter: 'Maria Santos',
        items: [
          {
            id: '2-1',
            name: 'Pizza Margherita',
            quantity: 1,
            notes: 'Extra queijo',
            completed: true
          },
          {
            id: '2-2',
            name: 'Salada Caesar',
            quantity: 1,
            completed: false
          }
        ]
      },
      {
        id: '3',
        number: '003',
        table: 8,
        status: 'ready',
        createdAt: new Date(Date.now() - 25 * 60000), // 25 minutos atrás
        estimatedTime: 15,
        waiter: 'Pedro Costa',
        items: [
          {
            id: '3-1',
            name: 'Hambúrguer Artesanal',
            quantity: 2,
            completed: true
          },
          {
            id: '3-2',
            name: 'Batata Frita',
            quantity: 2,
            completed: true
          }
        ]
      },
      {
        id: '4',
        number: '004',
        table: 12,
        status: 'pending',
        createdAt: new Date(Date.now() - 35 * 60000), // 35 minutos atrás
        estimatedTime: 30,
        waiter: 'Ana Lima',
        items: [
          {
            id: '4-1',
            name: 'Risotto de Camarão',
            quantity: 1,
            notes: 'Pouco sal',
            completed: false
          }
        ]
      }
    ]);

    // Computed
    const filteredOrders = computed(() => {
      let filtered = orders.value;

      // Filtrar por status
      if (activeFilter.value !== 'all') {
        filtered = filtered.filter(order => order.status === activeFilter.value);
      }

      // Filtrar por busca
      if (searchTerm.value) {
        const search = searchTerm.value.toLowerCase();
        filtered = filtered.filter(order => 
          order.number.toLowerCase().includes(search) ||
          order.table.toString().includes(search) ||
          order.items.some(item => item.name.toLowerCase().includes(search))
        );
      }

      // Ordenar por prioridade (urgente primeiro, depois por data)
      return filtered.sort((a, b) => {
        const aUrgent = isUrgent(a);
        const bUrgent = isUrgent(b);
        
        if (aUrgent && !bUrgent) return -1;
        if (!aUrgent && bUrgent) return 1;
        
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
    });

    // Methods
    const isUrgent = (order: Order): boolean => {
      const elapsed = Date.now() - order.createdAt.getTime();
      const elapsedMinutes = elapsed / (1000 * 60);
      
      if (order.estimatedTime) {
        return elapsedMinutes > order.estimatedTime * 0.8; // 80% do tempo estimado
      }
      
      return elapsedMinutes > 30; // Mais de 30 minutos
    };

    const formatTime = (date: Date): string => {
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    };

    const getElapsedTime = (createdAt: Date): string => {
      const elapsed = Date.now() - createdAt.getTime();
      const minutes = Math.floor(elapsed / (1000 * 60));
      
      if (minutes < 60) {
        return `${minutes}min`;
      } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}min`;
      }
    };

    const allItemsCompleted = (order: Order): boolean => {
      return order.items.every(item => item.completed);
    };

    const toggleItemCompleted = (order: Order, item: OrderItem) => {
      item.completed = !item.completed;
    };

    const updateOrderStatus = (order: Order) => {
      // Aqui você pode adicionar lógica adicional quando o status muda
      console.log(`Pedido ${order.number} atualizado para: ${order.status}`);
    };

    const startPreparing = (order: Order) => {
      order.status = 'preparing';
      updateOrderStatus(order);
    };

    const markAsReady = (order: Order) => {
      if (allItemsCompleted(order)) {
        order.status = 'ready';
        updateOrderStatus(order);
      }
    };

    const markAsDelivered = (order: Order) => {
      order.status = 'delivered';
      updateOrderStatus(order);
      
      // Remove o pedido da lista após 2 segundos
      setTimeout(() => {
        const index = orders.value.findIndex(o => o.id === order.id);
        if (index > -1) {
          orders.value.splice(index, 1);
        }
      }, 2000);
    };

    const getEmptyStateMessage = (): string => {
      switch (activeFilter.value) {
        case 'pending':
          return 'Nenhum pedido pendente no momento.';
        case 'preparing':
          return 'Nenhum pedido em preparo no momento.';
        case 'ready':
          return 'Nenhum pedido pronto para entrega.';
        default:
          return 'Nenhum pedido encontrado.';
      }
    };

    return {
      activeFilter,
      searchTerm,
      orders,
      filteredOrders,
      isUrgent,
      formatTime,
      getElapsedTime,
      allItemsCompleted,
      toggleItemCompleted,
      updateOrderStatus,
      startPreparing,
      markAsReady,
      markAsDelivered,
      getEmptyStateMessage
    };
  }
});
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

.dashboard-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* Header da página */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.header-stats {
  display: flex;
  gap: 1rem;
}

.stat-card {
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 80px;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a73e8;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #718096;
  text-transform: uppercase;
  font-weight: 500;
}

/* Filtros */
.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  color: #718096;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab:hover {
  border-color: #1a73e8;
  color: #1a73e8;
}

.filter-tab.active {
  background: #1a73e8;
  border-color: #1a73e8;
  color: white;
}

.search-box {
  position: relative;
  min-width: 300px;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: #1a73e8;
}

/* Grid de pedidos */
.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.order-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid #e2e8f0;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.order-card.status-pending {
  border-left-color: #fbbf24;
}

.order-card.status-preparing {
  border-left-color: #f59e0b;
}

.order-card.status-ready {
  border-left-color: #10b981;
}

.order-card.urgent {
  border-left-color: #ef4444;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }
}

/* Header do pedido */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid #f7fafc;
}

.order-info h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem;
}

.order-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: 0.85rem;
  color: #718096;
}

.table {
  font-weight: 600;
  color: #1a73e8;
}

.priority {
  background: #fed7d7;
  color: #c53030;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 0.75rem;
}

.status-select {
  padding: 0.5rem 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s;
}

.status-select.status-pending {
  border-color: #fbbf24;
  color: #d97706;
}

.status-select.status-preparing {
  border-color: #f59e0b;
  color: #92400e;
}

.status-select.status-ready {
  border-color: #10b981;
  color: #047857;
}

/* Itens do pedido */
.order-items {
  padding: 0 1.5rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 0;
  border-bottom: 1px solid #f7fafc;
}

.order-item:last-child {
  border-bottom: none;
}

.item-info {
  flex: 1;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.item-name {
  font-weight: 600;
  color: #1a202c;
}

.item-quantity {
  font-weight: 700;
  color: #1a73e8;
  background: #ebf8ff;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.85rem;
}

.item-details {
  font-size: 0.85rem;
  color: #718096;
}

.item-notes {
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-modifications {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.modification {
  background: #f7fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
}

.item-actions {
  margin-left: 1rem;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  background: white;
  color: #a0aec0;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  border-color: #10b981;
  color: #10b981;
}

.btn-icon.completed {
  border-color: #10b981;
  background: #10b981;
  color: white;
}

/* Footer do pedido */
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f7fafc;
}

.order-timing {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.elapsed-time {
  font-weight: 600;
  color: #1a202c;
}

.estimated-time {
  font-size: 0.8rem;
  color: #718096;
}

.order-actions {
  display: flex;
  gap: 0.5rem;
}

/* Botões */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #1a73e8;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1557b0;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #059669;
}

.btn-outline {
  background: white;
  color: #718096;
  border: 2px solid #e2e8f0;
}

.btn-outline:hover {
  border-color: #1a73e8;
  color: #1a73e8;
}

/* Estado vazio */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

/* Responsividade */
@media (max-width: 900px) {
  .dashboard-layout {
    flex-direction: column;
  }
  
  .dashboard-content {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .filters {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .filter-tabs {
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .orders-grid {
    grid-template-columns: 1fr;
  }
  
  .order-header,
  .order-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}

@media (max-width: 600px) {
  .header-stats {
    flex-wrap: wrap;
  }
  
  .stat-card {
    flex: 1;
    min-width: 60px;
  }
  
  .search-box {
    min-width: unset;
  }
  
  .order-item {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .item-actions {
    margin-left: 0;
    align-self: flex-end;
  }
}
</style>
