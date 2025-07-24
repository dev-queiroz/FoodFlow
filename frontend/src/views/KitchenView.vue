<template>
  <div class="dashboard-layout">
    <SidebarMenu />
    <div class="dashboard-content">
      <!-- Header da página -->
      <div class="page-header">
        <h1>Painel da Cozinha</h1>
        <div class="header-info">
          <div class="pending-orders">
            <i class="fas fa-clock"></i>
            <span>{{ pendingOrdersCount }} pedidos pendentes</span>
          </div>
          <div class="preparing-orders">
            <i class="fas fa-fire"></i>
            <span>{{ preparingOrdersCount }} em preparação</span>
          </div>
          <div class="kitchen-status">
            <i class="fas fa-check-circle"></i>
            <span>Cozinha Operando</span>
          </div>
        </div>
      </div>

      <!-- Filtros de status -->
      <div class="status-filters">
        <button 
          class="filter-btn" 
          :class="{ active: statusFilter === 'all' }"
          @click="statusFilter = 'all'"
        >
          <i class="fas fa-list"></i>
          Todos ({{ orders.length }})
        </button>
        <button 
          class="filter-btn pending" 
          :class="{ active: statusFilter === 'pending' }"
          @click="statusFilter = 'pending'"
        >
          <i class="fas fa-clock"></i>
          Pendentes ({{ pendingOrdersCount }})
        </button>
        <button 
          class="filter-btn preparing" 
          :class="{ active: statusFilter === 'preparing' }"
          @click="statusFilter = 'preparing'"
        >
          <i class="fas fa-fire"></i>
          Em Preparação ({{ preparingOrdersCount }})
        </button>
        <button 
          class="filter-btn ready" 
          :class="{ active: statusFilter === 'ready' }"
          @click="statusFilter = 'ready'"
        >
          <i class="fas fa-check"></i>
          Prontos ({{ readyOrdersCount }})
        </button>
      </div>

      <!-- Lista de pedidos -->
      <div class="orders-container">
        <div class="orders-grid">
          <div 
            v-for="order in filteredOrders" 
            :key="order.id"
            class="order-card"
            :class="order.status"
          >
            <div class="order-header">
              <div class="order-info">
                <h3>Mesa {{ order.table }}</h3>
                <span class="order-time">{{ formatOrderTime(order.createdAt) }}</span>
              </div>
              <div class="order-status" :class="order.status">
                {{ getStatusText(order.status) }}
              </div>
            </div>

            <div class="order-items">
              <div 
                v-for="item in order.items" 
                :key="item.id"
                class="order-item"
              >
                <div class="item-info">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-quantity">x{{ item.quantity }}</span>
                </div>
                <div v-if="item.notes" class="item-notes">
                  <i class="fas fa-sticky-note"></i>
                  {{ item.notes }}
                </div>
              </div>
            </div>

            <div v-if="order.notes" class="order-notes">
              <i class="fas fa-comment"></i>
              <span>{{ order.notes }}</span>
            </div>

            <div class="order-actions">
              <button 
                v-if="order.status === 'pending'"
                class="btn btn-primary"
                @click="startPreparing(order)"
              >
                <i class="fas fa-play"></i>
                Iniciar Preparação
              </button>
              
              <button 
                v-if="order.status === 'preparing'"
                class="btn btn-success"
                @click="markAsReady(order)"
              >
                <i class="fas fa-check"></i>
                Marcar como Pronto
              </button>
              
              <button 
                v-if="order.status === 'ready'"
                class="btn btn-outline"
                disabled
              >
                <i class="fas fa-clock"></i>
                Aguardando Entrega
              </button>
            </div>

            <div class="order-timer" v-if="order.status === 'preparing'">
              <i class="fas fa-stopwatch"></i>
              <span>{{ getPreparingTime(order.startedAt) }}</span>
            </div>

            <div class="priority-indicator" v-if="order.priority === 'high'">
              <i class="fas fa-exclamation-triangle"></i>
              Urgente
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

      <!-- Resumo das estatísticas -->
      <div class="kitchen-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ todayOrdersCount }}</span>
            <span class="stat-label">Pedidos Hoje</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ averagePreparationTime }}min</span>
            <span class="stat-label">Tempo Médio</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-trophy"></i>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ completedOrdersCount }}</span>
            <span class="stat-label">Finalizados</span>
          </div>
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
}

interface Order {
  id: string;
  table: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  items: OrderItem[];
  notes?: string;
  createdAt: Date;
  startedAt?: Date;
  readyAt?: Date;
  priority?: 'normal' | 'high';
}

export default defineComponent({
  name: 'KitchenView',
  components: {
    SidebarMenu
  },
  setup() {
    const statusFilter = ref('all');

    // Dados mock
    const orders = ref<Order[]>([
      {
        id: '1',
        table: 5,
        status: 'pending',
        items: [
          { id: '1', name: 'Salmão Grelhado', quantity: 2 },
          { id: '2', name: 'Risotto de Camarão', quantity: 1, notes: 'Sem pimentão' }
        ],
        notes: 'Cliente tem alergia a frutos do mar no risotto',
        createdAt: new Date(Date.now() - 300000), // 5 min atrás
        priority: 'high'
      },
      {
        id: '2',
        table: 3,
        status: 'preparing',
        items: [
          { id: '3', name: 'Bruschetta Italiana', quantity: 1 },
          { id: '4', name: 'Tiramisu', quantity: 2 }
        ],
        createdAt: new Date(Date.now() - 900000), // 15 min atrás
        startedAt: new Date(Date.now() - 600000), // começou há 10 min
        priority: 'normal'
      },
      {
        id: '3',
        table: 7,
        status: 'preparing',
        items: [
          { id: '5', name: 'Carpaccio de Salmão', quantity: 1 },
          { id: '6', name: 'Suco Natural', quantity: 3 }
        ],
        createdAt: new Date(Date.now() - 1200000), // 20 min atrás
        startedAt: new Date(Date.now() - 300000), // começou há 5 min
        priority: 'normal'
      },
      {
        id: '4',
        table: 2,
        status: 'ready',
        items: [
          { id: '7', name: 'Salmão Grelhado', quantity: 1 },
          { id: '8', name: 'Bruschetta Italiana', quantity: 2 }
        ],
        createdAt: new Date(Date.now() - 1800000), // 30 min atrás
        startedAt: new Date(Date.now() - 1200000), // começou há 20 min
        readyAt: new Date(Date.now() - 300000), // ficou pronto há 5 min
        priority: 'normal'
      }
    ]);

    // Computed
    const filteredOrders = computed(() => {
      if (statusFilter.value === 'all') {
        return orders.value.filter(order => order.status !== 'delivered');
      }
      return orders.value.filter(order => order.status === statusFilter.value);
    });

    const pendingOrdersCount = computed(() => {
      return orders.value.filter(order => order.status === 'pending').length;
    });

    const preparingOrdersCount = computed(() => {
      return orders.value.filter(order => order.status === 'preparing').length;
    });

    const readyOrdersCount = computed(() => {
      return orders.value.filter(order => order.status === 'ready').length;
    });

    const todayOrdersCount = computed(() => {
      return orders.value.length + 15; // Simular mais pedidos do dia
    });

    const averagePreparationTime = computed(() => {
      return 18; // Tempo médio simulado
    });

    const completedOrdersCount = computed(() => {
      return orders.value.filter(order => order.status === 'delivered').length + 12; // Simular pedidos finalizados
    });

    // Methods
    const getStatusText = (status: string) => {
      const statusMap = {
        pending: 'Pendente',
        preparing: 'Em Preparação',
        ready: 'Pronto',
        delivered: 'Entregue'
      };
      return statusMap[status as keyof typeof statusMap] || status;
    };

    const formatOrderTime = (date: Date) => {
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      
      if (minutes < 60) {
        return `${minutes}min atrás`;
      }
      
      const hours = Math.floor(minutes / 60);
      return `${hours}h ${minutes % 60}min atrás`;
    };

    const getPreparingTime = (startedAt?: Date) => {
      if (!startedAt) return '0min';
      
      const now = new Date();
      const diff = now.getTime() - startedAt.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      
      return `${minutes}min`;
    };

    const startPreparing = (order: Order) => {
      order.status = 'preparing';
      order.startedAt = new Date();
    };

    const markAsReady = (order: Order) => {
      order.status = 'ready';
      order.readyAt = new Date();
      
      // Simular notificação para o garçom
      console.log(`Pedido da Mesa ${order.table} está pronto!`);
    };

    const getEmptyStateMessage = () => {
      switch (statusFilter.value) {
        case 'pending':
          return 'Nenhum pedido pendente no momento.';
        case 'preparing':
          return 'Nenhum pedido em preparação no momento.';
        case 'ready':
          return 'Nenhum pedido pronto para entrega.';
        default:
          return 'Nenhum pedido ativo no momento.';
      }
    };

    return {
      statusFilter,
      orders,
      filteredOrders,
      pendingOrdersCount,
      preparingOrdersCount,
      readyOrdersCount,
      todayOrdersCount,
      averagePreparationTime,
      completedOrdersCount,
      getStatusText,
      formatOrderTime,
      getPreparingTime,
      startPreparing,
      markAsReady,
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

/* Header */
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

.header-info {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.pending-orders, .preparing-orders, .kitchen-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-weight: 500;
}

.pending-orders {
  color: #d69e2e;
  border-left: 4px solid #d69e2e;
}

.preparing-orders {
  color: #e53e3e;
  border-left: 4px solid #e53e3e;
}

.kitchen-status {
  color: #38a169;
  border-left: 4px solid #38a169;
}

/* Filtros de status */
.status-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 0.5rem;
  font-weight: 500;
  color: #718096;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #1a73e8;
  color: #1a73e8;
}

.filter-btn.active {
  background: #1a73e8;
  border-color: #1a73e8;
  color: white;
}

.filter-btn.pending.active {
  background: #d69e2e;
  border-color: #d69e2e;
}

.filter-btn.preparing.active {
  background: #e53e3e;
  border-color: #e53e3e;
}

.filter-btn.ready.active {
  background: #38a169;
  border-color: #38a169;
}

/* Container de pedidos */
.orders-container {
  margin-bottom: 2rem;
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

/* Card do pedido */
.order-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #e2e8f0;
  position: relative;
  transition: all 0.2s;
}

.order-card.pending {
  border-left-color: #d69e2e;
}

.order-card.preparing {
  border-left-color: #e53e3e;
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.15);
}

.order-card.ready {
  border-left-color: #38a169;
  box-shadow: 0 4px 12px rgba(56, 161, 105, 0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.order-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.25rem;
}

.order-time {
  font-size: 0.875rem;
  color: #718096;
}

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.order-status.pending {
  background: #faf089;
  color: #744210;
}

.order-status.preparing {
  background: #fed7d7;
  color: #742a2a;
}

.order-status.ready {
  background: #c6f6d5;
  color: #22543d;
}

/* Itens do pedido */
.order-items {
  margin-bottom: 1rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f7fafc;
}

.order-item:last-child {
  border-bottom: none;
}

.item-info {
  flex: 1;
}

.item-name {
  font-weight: 500;
  color: #1a202c;
  display: block;
  margin-bottom: 0.25rem;
}

.item-quantity {
  font-size: 0.875rem;
  color: #1a73e8;
  font-weight: 600;
}

.item-notes {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #fff5f5;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #e53e3e;
}

/* Observações do pedido */
.order-notes {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #ebf8ff;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #1a73e8;
}

/* Ações do pedido */
.order-actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  justify-content: center;
}

.btn-primary {
  background: #1a73e8;
  color: white;
}

.btn-primary:hover {
  background: #1557b0;
}

.btn-success {
  background: #38a169;
  color: white;
}

.btn-success:hover {
  background: #2f855a;
}

.btn-outline {
  background: white;
  color: #718096;
  border: 2px solid #e2e8f0;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Timer de preparação */
.order-timer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #e53e3e;
  font-weight: 600;
}

/* Indicador de prioridade */
.priority-indicator {
  position: absolute;
  top: -0.5rem;
  right: 1rem;
  background: #fed7d7;
  color: #e53e3e;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Estado vazio */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #a0aec0;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
  color: #4a5568;
}

.empty-state p {
  margin: 0;
  font-size: 1.125rem;
}

/* Estatísticas da cozinha */
.kitchen-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  background: #ebf8ff;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a73e8;
  font-size: 1.25rem;
}

.stat-info {
  flex: 1;
}

.stat-number {
  display: block;
  font-size: 1.875rem;
  font-weight: 700;
  color: #1a202c;
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: #718096;
  text-transform: uppercase;
  font-weight: 500;
}

/* Responsividade */
@media (max-width: 1200px) {
  .orders-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

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
  }
  
  .header-info {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
  
  .status-filters {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .orders-grid {
    grid-template-columns: 1fr;
  }
  
  .kitchen-stats {
    grid-template-columns: 1fr;
  }
}
</style>
