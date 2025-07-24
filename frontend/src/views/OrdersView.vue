<template>
  <div class="dashboard-layout">
    <SidebarMenu />
    <div class="dashboard-content">
      <!-- Header da página -->
      <div class="page-header">
        <h1>Gestão de Pedidos</h1>
        <div class="header-actions">
          <button class="btn btn-outline" @click="refreshOrders">
            <i class="fas fa-sync-alt"></i>
            Atualizar
          </button>
          <button class="btn btn-primary" @click="exportOrders">
            <i class="fas fa-download"></i>
            Exportar
          </button>
        </div>
      </div>

      <!-- Estatísticas rápidas -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon pending">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stat-info">
            <h3>{{ getPendingOrders().length }}</h3>
            <p>Pedidos Pendentes</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon preparing">
            <i class="fas fa-fire"></i>
          </div>
          <div class="stat-info">
            <h3>{{ getPreparingOrders().length }}</h3>
            <p>Em Preparação</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon ready">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-info">
            <h3>{{ getReadyOrders().length }}</h3>
            <p>Prontos</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon delivered">
            <i class="fas fa-truck"></i>
          </div>
          <div class="stat-info">
            <h3>{{ getDeliveredOrders().length }}</h3>
            <p>Entregues</p>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Buscar por número do pedido..." 
            v-model="searchTerm"
          >
        </div>
        <select v-model="selectedStatus" class="status-filter">
          <option value="">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="preparing">Em Preparação</option>
          <option value="ready">Pronto</option>
          <option value="delivered">Entregue</option>
          <option value="cancelled">Cancelado</option>
        </select>
        <select v-model="selectedTable" class="table-filter">
          <option value="">Todas as mesas</option>
          <option v-for="table in tables" :key="table.id" :value="table.id">
            Mesa {{ table.number }}
          </option>
        </select>
        <select v-model="selectedOrderType" class="type-filter">
          <option value="">Todos os tipos</option>
          <option value="dine_in">Consumo Local</option>
          <option value="takeaway">Retirada</option>
          <option value="delivery">Entrega</option>
        </select>
        <input type="date" v-model="selectedDate" class="date-filter">
      </div>

      <!-- Visualização de pedidos -->
      <div class="orders-section">
        <div class="section-header">
          <h2>Pedidos</h2>
          <div class="view-toggle">
            <button 
              class="toggle-btn" 
              :class="{ active: viewMode === 'cards' }"
              @click="viewMode = 'cards'"
            >
              <i class="fas fa-th-large"></i>
              Cards
            </button>
            <button 
              class="toggle-btn" 
              :class="{ active: viewMode === 'table' }"
              @click="viewMode = 'table'"
            >
              <i class="fas fa-table"></i>
              Tabela
            </button>
          </div>
        </div>

        <!-- Visualização em Cards -->
        <div v-if="viewMode === 'cards'" class="orders-grid">
          <div 
            v-for="order in filteredOrders" 
            :key="order.id" 
            class="order-card"
            :class="`status-${order.status}`"
          >
            <div class="order-header">
              <div class="order-number">
                <h3>#{{ order.number }}</h3>
                <span class="order-type">{{ getOrderTypeText(order.type) }}</span>
              </div>
              <div class="order-status">
                <span class="status-badge" :class="order.status">
                  {{ getStatusText(order.status) }}
                </span>
              </div>
            </div>

            <div class="order-details">
              <div class="detail-row">
                <i class="fas fa-clock"></i>
                <span>{{ formatTime(order.createdAt) }}</span>
              </div>
              <div class="detail-row" v-if="order.tableId">
                <i class="fas fa-chair"></i>
                <span>Mesa {{ getTableNumber(order.tableId) }}</span>
              </div>
              <div class="detail-row">
                <i class="fas fa-user"></i>
                <span>{{ order.customerName || 'Cliente Anônimo' }}</span>
              </div>
              <div class="detail-row">
                <i class="fas fa-utensils"></i>
                <span>{{ order.items.length }} itens</span>
              </div>
              <div class="detail-row">
                <i class="fas fa-dollar-sign"></i>
                <span>{{ formatCurrency(order.total) }}</span>
              </div>
            </div>

            <div class="order-items">
              <h4>Itens do Pedido:</h4>
              <div class="items-list">
                <div 
                  v-for="item in order.items" 
                  :key="item.id"
                  class="order-item"
                >
                  <span class="item-quantity">{{ item.quantity }}x</span>
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-price">{{ formatCurrency(item.price * item.quantity) }}</span>
                </div>
              </div>
            </div>

            <div v-if="order.notes" class="order-notes">
              <i class="fas fa-sticky-note"></i>
              <span>{{ order.notes }}</span>
            </div>

            <div class="order-actions">
              <button 
                v-if="order.status === 'pending'" 
                class="btn btn-primary btn-sm" 
                @click="acceptOrder(order)"
              >
                <i class="fas fa-check"></i>
                Aceitar
              </button>
              <button 
                v-if="order.status === 'preparing'" 
                class="btn btn-success btn-sm" 
                @click="markAsReady(order)"
              >
                <i class="fas fa-bell"></i>
                Marcar Pronto
              </button>
              <button 
                v-if="order.status === 'ready'" 
                class="btn btn-info btn-sm" 
                @click="markAsDelivered(order)"
              >
                <i class="fas fa-truck"></i>
                Entregar
              </button>
              <button 
                class="btn btn-outline btn-sm" 
                @click="viewOrderDetails(order)"
              >
                <i class="fas fa-eye"></i>
                Detalhes
              </button>
              <button 
                v-if="order.status !== 'cancelled' && order.status !== 'delivered'" 
                class="btn btn-danger btn-sm" 
                @click="cancelOrder(order)"
              >
                <i class="fas fa-times"></i>
                Cancelar
              </button>
            </div>

            <div v-if="order.status === 'preparing'" class="preparation-timer">
              <i class="fas fa-stopwatch"></i>
              <span>{{ getPreparationTime(order.acceptedAt) }}</span>
            </div>
          </div>

          <div v-if="filteredOrders.length === 0" class="empty-state">
            <i class="fas fa-shopping-cart"></i>
            <p>Nenhum pedido encontrado</p>
          </div>
        </div>

        <!-- Visualização em Tabela -->
        <div v-if="viewMode === 'table'" class="orders-table-container">
          <table class="orders-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Horário</th>
                <th>Cliente</th>
                <th>Mesa</th>
                <th>Tipo</th>
                <th>Itens</th>
                <th>Total</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="order in filteredOrders" 
                :key="order.id"
                :class="`status-${order.status}`"
              >
                <td class="order-number">#{{ order.number }}</td>
                <td>{{ formatTime(order.createdAt) }}</td>
                <td>{{ order.customerName || 'Anônimo' }}</td>
                <td>{{ order.tableId ? `Mesa ${getTableNumber(order.tableId)}` : '-' }}</td>
                <td>{{ getOrderTypeText(order.type) }}</td>
                <td>{{ order.items.length }} itens</td>
                <td class="total">{{ formatCurrency(order.total) }}</td>
                <td>
                  <span class="status-badge" :class="order.status">
                    {{ getStatusText(order.status) }}
                  </span>
                </td>
                <td class="actions">
                  <div class="action-buttons">
                    <button 
                      v-if="order.status === 'pending'" 
                      class="btn-icon" 
                      @click="acceptOrder(order)"
                      title="Aceitar"
                    >
                      <i class="fas fa-check"></i>
                    </button>
                    <button 
                      v-if="order.status === 'preparing'" 
                      class="btn-icon" 
                      @click="markAsReady(order)"
                      title="Marcar como Pronto"
                    >
                      <i class="fas fa-bell"></i>
                    </button>
                    <button 
                      v-if="order.status === 'ready'" 
                      class="btn-icon" 
                      @click="markAsDelivered(order)"
                      title="Marcar como Entregue"
                    >
                      <i class="fas fa-truck"></i>
                    </button>
                    <button 
                      class="btn-icon" 
                      @click="viewOrderDetails(order)"
                      title="Ver Detalhes"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button 
                      v-if="order.status !== 'cancelled' && order.status !== 'delivered'" 
                      class="btn-icon danger" 
                      @click="cancelOrder(order)"
                      title="Cancelar"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="filteredOrders.length === 0" class="empty-state">
            <i class="fas fa-shopping-cart"></i>
            <p>Nenhum pedido encontrado</p>
          </div>
        </div>
      </div>

      <!-- Modal de detalhes do pedido -->
      <div v-if="showOrderDetails" class="modal-overlay" @click="showOrderDetails = false">
        <div class="modal large" @click.stop>
          <div class="modal-header">
            <h3>Detalhes do Pedido #{{ selectedOrder?.number }}</h3>
            <button class="modal-close" @click="showOrderDetails = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body" v-if="selectedOrder">
            <div class="order-details-grid">
              <div class="details-section">
                <h4>Informações Gerais</h4>
                <div class="info-grid">
                  <div class="info-item">
                    <label>Número do Pedido:</label>
                    <span>#{{ selectedOrder.number }}</span>
                  </div>
                  <div class="info-item">
                    <label>Status:</label>
                    <span class="status-badge" :class="selectedOrder.status">
                      {{ getStatusText(selectedOrder.status) }}
                    </span>
                  </div>
                  <div class="info-item">
                    <label>Tipo:</label>
                    <span>{{ getOrderTypeText(selectedOrder.type) }}</span>
                  </div>
                  <div class="info-item">
                    <label>Criado em:</label>
                    <span>{{ formatDateTime(selectedOrder.createdAt) }}</span>
                  </div>
                  <div class="info-item" v-if="selectedOrder.tableId">
                    <label>Mesa:</label>
                    <span>Mesa {{ getTableNumber(selectedOrder.tableId) }}</span>
                  </div>
                  <div class="info-item">
                    <label>Cliente:</label>
                    <span>{{ selectedOrder.customerName || 'Anônimo' }}</span>
                  </div>
                </div>
              </div>

              <div class="details-section">
                <h4>Itens do Pedido</h4>
                <div class="items-detail-list">
                  <div 
                    v-for="item in selectedOrder.items" 
                    :key="item.id"
                    class="item-detail"
                  >
                    <div class="item-info">
                      <div class="item-name">{{ item.name }}</div>
                      <div class="item-description" v-if="item.description">
                        {{ item.description }}
                      </div>
                      <div class="item-modifications" v-if="item.modifications">
                        <strong>Modificações:</strong> {{ item.modifications }}
                      </div>
                    </div>
                    <div class="item-quantity">{{ item.quantity }}x</div>
                    <div class="item-price">{{ formatCurrency(item.price) }}</div>
                    <div class="item-total">{{ formatCurrency(item.price * item.quantity) }}</div>
                  </div>
                </div>
              </div>

              <div class="details-section" v-if="selectedOrder.notes">
                <h4>Observações</h4>
                <div class="order-notes-detail">
                  {{ selectedOrder.notes }}
                </div>
              </div>

              <div class="details-section">
                <h4>Resumo Financeiro</h4>
                <div class="financial-summary">
                  <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>{{ formatCurrency(selectedOrder.subtotal) }}</span>
                  </div>
                  <div class="summary-row" v-if="selectedOrder.tax > 0">
                    <span>Taxa de Serviço:</span>
                    <span>{{ formatCurrency(selectedOrder.tax) }}</span>
                  </div>
                  <div class="summary-row" v-if="selectedOrder.discount > 0">
                    <span>Desconto:</span>
                    <span>-{{ formatCurrency(selectedOrder.discount) }}</span>
                  </div>
                  <div class="summary-row total">
                    <span>Total:</span>
                    <span>{{ formatCurrency(selectedOrder.total) }}</span>
                  </div>
                </div>
              </div>
            </div>
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
  description?: string;
  price: number;
  quantity: number;
  modifications?: string;
}

interface Order {
  id: string;
  number: string;
  customerName?: string;
  customerPhone?: string;
  tableId?: string;
  type: 'dine_in' | 'takeaway' | 'delivery';
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
  createdAt: string;
  acceptedAt?: string;
  readyAt?: string;
  deliveredAt?: string;
}

interface Table {
  id: string;
  number: number;
}

export default defineComponent({
  name: 'OrdersView',
  components: {
    SidebarMenu
  },
  setup() {
    const searchTerm = ref('');
    const selectedStatus = ref('');
    const selectedTable = ref('');
    const selectedOrderType = ref('');
    const selectedDate = ref('');
    const viewMode = ref<'cards' | 'table'>('cards');
    const showOrderDetails = ref(false);
    const selectedOrder = ref<Order | null>(null);

    // Dados mock
    const tables = ref<Table[]>([
      { id: '1', number: 1 },
      { id: '2', number: 2 },
      { id: '3', number: 3 },
      { id: '4', number: 4 },
      { id: '5', number: 5 }
    ]);

    const orders = ref<Order[]>([
      {
        id: '1',
        number: 'ORD-001',
        customerName: 'João Silva',
        customerPhone: '(11) 99999-1111',
        tableId: '2',
        type: 'dine_in',
        status: 'preparing',
        items: [
          {
            id: '1',
            name: 'Hambúrguer Clássico',
            description: 'Pão, carne, queijo, alface e tomate',
            price: 25.90,
            quantity: 2
          },
          {
            id: '2',
            name: 'Batata Frita',
            price: 12.90,
            quantity: 1
          }
        ],
        subtotal: 64.70,
        tax: 6.47,
        discount: 0,
        total: 71.17,
        notes: 'Sem cebola no hambúrguer',
        createdAt: '2025-07-19T18:30:00Z',
        acceptedAt: '2025-07-19T18:32:00Z'
      },
      {
        id: '2',
        number: 'ORD-002',
        customerName: 'Maria Santos',
        tableId: '1',
        type: 'dine_in',
        status: 'pending',
        items: [
          {
            id: '3',
            name: 'Pizza Margherita',
            description: 'Molho de tomate, mussarela e manjericão',
            price: 35.90,
            quantity: 1
          },
          {
            id: '4',
            name: 'Refrigerante',
            price: 5.90,
            quantity: 2
          }
        ],
        subtotal: 47.70,
        tax: 4.77,
        discount: 0,
        total: 52.47,
        createdAt: '2025-07-19T19:15:00Z'
      },
      {
        id: '3',
        number: 'ORD-003',
        customerName: 'Pedro Costa',
        type: 'takeaway',
        status: 'ready',
        items: [
          {
            id: '5',
            name: 'Sanduíche Natural',
            price: 18.90,
            quantity: 1
          },
          {
            id: '6',
            name: 'Suco Natural',
            price: 8.90,
            quantity: 1
          }
        ],
        subtotal: 27.80,
        tax: 0,
        discount: 2.78,
        total: 25.02,
        notes: 'Desconto de funcionário',
        createdAt: '2025-07-19T17:45:00Z',
        acceptedAt: '2025-07-19T17:46:00Z',
        readyAt: '2025-07-19T18:05:00Z'
      },
      {
        id: '4',
        number: 'ORD-004',
        customerName: 'Ana Oliveira',
        customerPhone: '(11) 88888-2222',
        type: 'delivery',
        status: 'delivered',
        items: [
          {
            id: '7',
            name: 'Lasanha Bolonhesa',
            price: 42.90,
            quantity: 1
          }
        ],
        subtotal: 42.90,
        tax: 4.29,
        discount: 0,
        total: 47.19,
        createdAt: '2025-07-19T16:20:00Z',
        acceptedAt: '2025-07-19T16:22:00Z',
        readyAt: '2025-07-19T16:55:00Z',
        deliveredAt: '2025-07-19T17:30:00Z'
      }
    ]);

    // Computed
    const filteredOrders = computed(() => {
      let filtered = orders.value;
      
      if (searchTerm.value) {
        filtered = filtered.filter(order => 
          order.number.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          (order.customerName && order.customerName.toLowerCase().includes(searchTerm.value.toLowerCase()))
        );
      }
      
      if (selectedStatus.value) {
        filtered = filtered.filter(order => order.status === selectedStatus.value);
      }
      
      if (selectedTable.value) {
        filtered = filtered.filter(order => order.tableId === selectedTable.value);
      }
      
      if (selectedOrderType.value) {
        filtered = filtered.filter(order => order.type === selectedOrderType.value);
      }
      
      if (selectedDate.value) {
        filtered = filtered.filter(order => 
          order.createdAt.split('T')[0] === selectedDate.value
        );
      }
      
      return filtered.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });

    // Methods para estatísticas
    const getPendingOrders = () => orders.value.filter(o => o.status === 'pending');
    const getPreparingOrders = () => orders.value.filter(o => o.status === 'preparing');
    const getReadyOrders = () => orders.value.filter(o => o.status === 'ready');
    const getDeliveredOrders = () => orders.value.filter(o => o.status === 'delivered');

    // Methods gerais
    const getStatusText = (status: string) => {
      const statusMap = {
        pending: 'Pendente',
        preparing: 'Preparando',
        ready: 'Pronto',
        delivered: 'Entregue',
        cancelled: 'Cancelado'
      };
      return statusMap[status as keyof typeof statusMap] || status;
    };

    const getOrderTypeText = (type: string) => {
      const typeMap = {
        dine_in: 'Consumo Local',
        takeaway: 'Retirada',
        delivery: 'Entrega'
      };
      return typeMap[type as keyof typeof typeMap] || type;
    };

    const getTableNumber = (tableId: string) => {
      const table = tables.value.find(t => t.id === tableId);
      return table ? table.number : 'N/A';
    };

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(amount);
    };

    const formatTime = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    };

    const formatDateTime = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR');
    };

    const getPreparationTime = (acceptedAt?: string) => {
      if (!acceptedAt) return '';
      
      const start = new Date(acceptedAt);
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      const minutes = Math.floor(diff / 60000);
      
      return `${minutes} min`;
    };

    // Actions
    const acceptOrder = (order: Order) => {
      order.status = 'preparing';
      order.acceptedAt = new Date().toISOString();
    };

    const markAsReady = (order: Order) => {
      order.status = 'ready';
      order.readyAt = new Date().toISOString();
    };

    const markAsDelivered = (order: Order) => {
      order.status = 'delivered';
      order.deliveredAt = new Date().toISOString();
    };

    const cancelOrder = (order: Order) => {
      if (confirm(`Tem certeza que deseja cancelar o pedido #${order.number}?`)) {
        order.status = 'cancelled';
      }
    };

    const viewOrderDetails = (order: Order) => {
      selectedOrder.value = order;
      showOrderDetails.value = true;
    };

    const refreshOrders = () => {
      console.log('Atualizando pedidos...');
    };

    const exportOrders = () => {
      console.log('Exportando pedidos...');
    };

    return {
      searchTerm,
      selectedStatus,
      selectedTable,
      selectedOrderType,
      selectedDate,
      viewMode,
      showOrderDetails,
      selectedOrder,
      tables,
      orders,
      filteredOrders,
      getPendingOrders,
      getPreparingOrders,
      getReadyOrders,
      getDeliveredOrders,
      getStatusText,
      getOrderTypeText,
      getTableNumber,
      formatCurrency,
      formatTime,
      formatDateTime,
      getPreparationTime,
      acceptOrder,
      markAsReady,
      markAsDelivered,
      cancelOrder,
      viewOrderDetails,
      refreshOrders,
      exportOrders
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

.header-actions {
  display: flex;
  gap: 1rem;
}

/* Estatísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
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
  border-radius: 0.5rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.stat-icon.pending { background: #f59e0b; }
.stat-icon.preparing { background: #ef4444; }
.stat-icon.ready { background: #10b981; }
.stat-icon.delivered { background: #3b82f6; }

.stat-info h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.25rem;
}

.stat-info p {
  color: #718096;
  margin: 0;
  font-size: 0.9rem;
}

/* Botões */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
}

.btn-primary {
  background: #1a73e8;
  color: white;
}

.btn-primary:hover {
  background: #1557b0;
}

.btn-outline {
  background: white;
  color: #1a73e8;
  border: 2px solid #1a73e8;
}

.btn-outline:hover {
  background: #1a73e8;
  color: white;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

.btn-info {
  background: #3b82f6;
  color: white;
}

.btn-info:hover {
  background: #2563eb;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  border: none;
  background: #f7fafc;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8rem;
}

.btn-icon:hover {
  background: #e2e8f0;
}

.btn-icon.danger {
  color: #e53e3e;
}

.btn-icon.danger:hover {
  background: #fed7d7;
}

/* Filtros */
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
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

.status-filter,
.table-filter,
.type-filter,
.date-filter {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  min-width: 140px;
}

/* Seção de pedidos */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.view-toggle {
  display: flex;
  background: #f7fafc;
  border-radius: 0.5rem;
  padding: 0.25rem;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  border-radius: 0.375rem;
  color: #718096;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn.active {
  background: white;
  color: #1a73e8;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  border-left: 4px solid;
}

.order-card.status-pending { border-left-color: #f59e0b; }
.order-card.status-preparing { border-left-color: #ef4444; }
.order-card.status-ready { border-left-color: #10b981; }
.order-card.status-delivered { border-left-color: #3b82f6; }
.order-card.status-cancelled { border-left-color: #6b7280; }

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 1.5rem 0;
}

.order-number h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.25rem;
}

.order-type {
  font-size: 0.8rem;
  color: #718096;
  text-transform: uppercase;
  font-weight: 500;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.preparing {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.ready {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.delivered {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.cancelled {
  background: #f3f4f6;
  color: #374151;
}

.order-details {
  padding: 1rem 1.5rem;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;
}

.detail-row i {
  color: #1a73e8;
  width: 1rem;
}

.order-items {
  padding: 0 1.5rem 1rem;
}

.order-items h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a5568;
  margin: 0 0 0.5rem;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.item-quantity {
  color: #1a73e8;
  font-weight: 600;
  min-width: 2rem;
}

.item-name {
  flex: 1;
  color: #4a5568;
}

.item-price {
  color: #1a202c;
  font-weight: 500;
}

.order-notes {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #f7fafc;
  border-top: 1px solid #e2e8f0;
  font-size: 0.9rem;
  color: #4a5568;
  font-style: italic;
}

.order-notes i {
  color: #f59e0b;
  margin-top: 0.125rem;
}

.order-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: #f7fafc;
  border-top: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

.preparation-timer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem;
  background: #fef3c7;
  color: #92400e;
  font-size: 0.8rem;
  font-weight: 600;
}

.preparation-timer i {
  color: #f59e0b;
}

/* Tabela de pedidos */
.orders-table-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th {
  background: #f7fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.9rem;
}

.orders-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.9rem;
}

.orders-table tr:hover {
  background: #f8fafc;
}

.order-number {
  font-weight: 600;
  color: #1a202c;
}

.total {
  font-weight: 600;
  color: #1a73e8;
}

.actions {
  width: 1px;
  white-space: nowrap;
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
}

/* Estado vazio */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #718096;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #e2e8f0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal.large {
  max-width: 900px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #a0aec0;
  cursor: pointer;
  padding: 0.25rem;
}

.modal-close:hover {
  color: #718096;
}

.modal-body {
  padding: 1.5rem;
}

/* Detalhes do pedido */
.order-details-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.details-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f7fafc;
  border-radius: 0.5rem;
}

.info-item label {
  font-weight: 500;
  color: #4a5568;
}

.items-detail-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-detail {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 1rem;
  align-items: flex-start;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 0.5rem;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-name {
  font-weight: 600;
  color: #1a202c;
}

.item-description {
  font-size: 0.9rem;
  color: #718096;
}

.item-modifications {
  font-size: 0.8rem;
  color: #f59e0b;
}

.item-quantity,
.item-price,
.item-total {
  font-weight: 600;
  color: #1a202c;
  text-align: right;
}

.order-notes-detail {
  padding: 1rem;
  background: #f7fafc;
  border-radius: 0.5rem;
  font-style: italic;
  color: #4a5568;
}

.financial-summary {
  background: #f7fafc;
  border-radius: 0.5rem;
  padding: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-row.total {
  font-weight: 700;
  font-size: 1.1rem;
  color: #1a202c;
  border-top: 2px solid #1a73e8;
  margin-top: 0.5rem;
  padding-top: 1rem;
}

/* Responsividade */
@media (max-width: 1200px) {
  .orders-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filters {
    flex-direction: column;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .orders-grid {
    grid-template-columns: 1fr;
  }
  
  .orders-table-container {
    overflow-x: auto;
  }
  
  .orders-table {
    min-width: 800px;
  }
  
  .item-detail {
    grid-template-columns: 1fr;
    text-align: left;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .order-actions {
    flex-direction: column;
  }
  
  .view-toggle {
    width: 100%;
    justify-content: center;
  }
}
</style>
