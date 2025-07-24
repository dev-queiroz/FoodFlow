<template>
  <div class="dashboard-layout">
    <SidebarMenu />
    <div class="dashboard-content">
      <!-- Header da página -->
      <div class="page-header">
        <h1>Painel do Garçom</h1>
        <div class="header-info">
          <div class="active-orders">
            <i class="fas fa-shopping-cart"></i>
            <span>{{ activeOrders.length }} pedidos ativos</span>
          </div>
          <div class="ready-notifications" v-if="readyOrders.length > 0">
            <i class="fas fa-bell"></i>
            <span>{{ readyOrders.length }} pedidos prontos</span>
          </div>
          <div class="waiter-info">
            <i class="fas fa-user"></i>
            <span>{{ waiterName }}</span>
          </div>
          <button class="btn btn-outline btn-small" @click="simulateNewReadyOrder">
            <i class="fas fa-plus"></i>
            Simular Pedido Pronto
          </button>
        </div>
      </div>

      <!-- Notificações de Pedidos Prontos -->
      <div v-if="readyOrders.length > 0" class="ready-orders-section">
        <div class="notification-header">
          <h3>
            <i class="fas fa-bell"></i>
            Pedidos Prontos para Entrega
          </h3>
          <button class="btn btn-outline btn-small" @click="clearAllNotifications">
            <i class="fas fa-check-double"></i>
            Marcar Todos como Entregues
          </button>
        </div>
        <div class="ready-orders-list">
          <div 
            v-for="order in readyOrders" 
            :key="order.id"
            class="ready-order-card"
          >
            <div class="ready-order-info">
              <div class="table-info">
                <h4>Mesa {{ order.table }}</h4>
                <span class="ready-time">Pronto há {{ formatReadyTime(order.readyAt) }}</span>
              </div>
              <div class="order-items-summary">
                <span class="items-count">{{ order.items.length }} itens</span>
                <div class="items-preview">
                  {{ order.items.map(item => `${item.quantity}x ${item.name}`).join(', ') }}
                </div>
              </div>
            </div>
            <div class="ready-order-actions">
              <button class="btn btn-success" @click="markAsDelivered(order)">
                <i class="fas fa-check"></i>
                Entregue
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Layout principal -->
      <div class="waiter-layout">
        <!-- Seção de Mesas -->
        <div class="tables-section">
          <div class="section-title">
            <h2>Mesas</h2>
            <div class="tables-filter">
              <button 
                class="filter-btn" 
                :class="{ active: tableFilter === 'all' }"
                @click="tableFilter = 'all'"
              >
                Todas
              </button>
              <button 
                class="filter-btn" 
                :class="{ active: tableFilter === 'available' }"
                @click="tableFilter = 'available'"
              >
                Livres
              </button>
              <button 
                class="filter-btn" 
                :class="{ active: tableFilter === 'occupied' }"
                @click="tableFilter = 'occupied'"
              >
                Ocupadas
              </button>
            </div>
          </div>

          <div class="tables-grid">
            <div 
              v-for="table in filteredTables" 
              :key="table.id"
              class="table-card"
              :class="{ 
                occupied: table.status === 'occupied',
                selected: selectedTable?.id === table.id 
              }"
              @click="selectTable(table)"
            >
              <div class="table-number">{{ table.number }}</div>
              <div class="table-info">
                <div class="table-status" :class="table.status">
                  {{ getTableStatusText(table.status) }}
                </div>
                <div v-if="table.status === 'occupied'" class="table-details">
                  <div class="customers">{{ table.customers }} pessoas</div>
                  <div class="time">{{ formatTime(table.occupiedSince) }}</div>
                </div>
              </div>
              <div v-if="table.hasOrders" class="orders-indicator">
                <i class="fas fa-receipt"></i>
                {{ table.ordersCount }}
              </div>
            </div>
          </div>
        </div>

        <!-- Seção do Pedido Atual -->
        <div class="order-section">
          <div class="order-header">
            <h2>
              {{ selectedTable ? `Mesa ${selectedTable.number}` : 'Selecione uma mesa' }}
            </h2>
            <div v-if="selectedTable && currentOrder.items.length > 0" class="order-actions">
              <button class="btn btn-outline" @click="clearOrder">
                <i class="fas fa-trash"></i>
                Limpar
              </button>
              <button class="btn btn-primary" @click="sendOrder">
                <i class="fas fa-paper-plane"></i>
                Enviar Pedido
              </button>
            </div>
          </div>

          <div v-if="selectedTable" class="order-content">
            <!-- Menu de produtos -->
            <div class="menu-section">
              <div class="menu-categories">
                <button 
                  v-for="category in categories" 
                  :key="category.id"
                  class="category-btn"
                  :class="{ active: selectedCategory === category.id }"
                  @click="selectedCategory = category.id"
                >
                  {{ category.name }}
                </button>
              </div>

              <div class="products-grid">
                <div 
                  v-for="product in filteredProducts" 
                  :key="product.id"
                  class="product-item"
                  @click="addToOrder(product)"
                >
                  <img :src="product.image" :alt="product.name" class="product-image" />
                  <div class="product-info">
                    <h4>{{ product.name }}</h4>
                    <p class="product-description">{{ product.description }}</p>
                    <div class="product-price">R$ {{ product.price.toFixed(2) }}</div>
                  </div>
                  <div class="add-button">
                    <i class="fas fa-plus"></i>
                  </div>
                </div>
              </div>
            </div>

            <!-- Resumo do pedido -->
            <div class="order-summary">
              <h3>Pedido Atual</h3>
              <div class="order-items">
                <div 
                  v-for="item in currentOrder.items" 
                  :key="item.id"
                  class="order-item"
                >
                  <div class="item-info">
                    <span class="item-name">{{ item.name }}</span>
                    <span class="item-price">R$ {{ item.price.toFixed(2) }}</span>
                  </div>
                  <div class="item-controls">
                    <button class="qty-btn" @click="decreaseQuantity(item)">
                      <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">{{ item.quantity }}</span>
                    <button class="qty-btn" @click="increaseQuantity(item)">
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                  <button class="remove-btn" @click="removeFromOrder(item)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div v-if="currentOrder.items.length === 0" class="empty-order">
                <i class="fas fa-utensils"></i>
                <p>Adicione produtos ao pedido</p>
              </div>

              <div v-if="currentOrder.items.length > 0" class="order-total">
                <div class="total-line">
                  <span>Subtotal:</span>
                  <span>R$ {{ orderSubtotal.toFixed(2) }}</span>
                </div>
                <div class="total-line final">
                  <span>Total:</span>
                  <span>R$ {{ orderSubtotal.toFixed(2) }}</span>
                </div>
              </div>

              <div v-if="currentOrder.items.length > 0" class="order-notes">
                <label>Observações:</label>
                <textarea 
                  v-model="currentOrder.notes" 
                  placeholder="Observações especiais do pedido..."
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <div v-else class="no-table-selected">
            <i class="fas fa-chair"></i>
            <h3>Selecione uma mesa</h3>
            <p>Escolha uma mesa para começar a fazer o pedido</p>
          </div>
        </div>
      </div>

      <!-- Modal de confirmação -->
      <div v-if="showConfirmModal" class="modal-overlay" @click="showConfirmModal = false">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>Confirmar Pedido</h3>
            <button class="modal-close" @click="showConfirmModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="confirm-details">
              <h4>Mesa {{ selectedTable?.number }}</h4>
              <div class="confirm-items">
                <div v-for="item in currentOrder.items" :key="item.id" class="confirm-item">
                  <span>{{ item.quantity }}x {{ item.name }}</span>
                  <span>R$ {{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>
              <div class="confirm-total">
                <strong>Total: R$ {{ orderSubtotal.toFixed(2) }}</strong>
              </div>
              <div v-if="currentOrder.notes" class="confirm-notes">
                <strong>Observações:</strong>
                <p>{{ currentOrder.notes }}</p>
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn btn-outline" @click="showConfirmModal = false">
                Cancelar
              </button>
              <button class="btn btn-primary" @click="confirmOrder">
                Confirmar Pedido
              </button>
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

interface Table {
  id: string;
  number: number;
  status: 'available' | 'occupied' | 'reserved';
  customers?: number;
  occupiedSince?: Date;
  hasOrders?: boolean;
  ordersCount?: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  items: OrderItem[];
  notes: string;
}

interface ReadyOrder {
  id: string;
  table: number;
  items: OrderItem[];
  readyAt: Date;
}

interface Category {
  id: string;
  name: string;
}

export default defineComponent({
  name: 'WaiterView',
  components: {
    SidebarMenu
  },
  setup() {
    const waiterName = ref('João Silva');
    const tableFilter = ref('all');
    const selectedTable = ref<Table | null>(null);
    const selectedCategory = ref('1');
    const showConfirmModal = ref(false);

    // Dados mock
    const tables = ref<Table[]>([
      { id: '1', number: 1, status: 'available' },
      { id: '2', number: 2, status: 'occupied', customers: 4, occupiedSince: new Date(Date.now() - 3600000), hasOrders: true, ordersCount: 2 },
      { id: '3', number: 3, status: 'available' },
      { id: '4', number: 4, status: 'occupied', customers: 2, occupiedSince: new Date(Date.now() - 1800000), hasOrders: false, ordersCount: 0 },
      { id: '5', number: 5, status: 'reserved' },
      { id: '6', number: 6, status: 'available' },
      { id: '7', number: 7, status: 'occupied', customers: 6, occupiedSince: new Date(Date.now() - 7200000), hasOrders: true, ordersCount: 3 },
      { id: '8', number: 8, status: 'available' }
    ]);

    const categories = ref<Category[]>([
      { id: '1', name: 'Entradas' },
      { id: '2', name: 'Pratos Principais' },
      { id: '3', name: 'Sobremesas' },
      { id: '4', name: 'Bebidas' }
    ]);

    const products = ref<Product[]>([
      {
        id: '1',
        name: 'Bruschetta Italiana',
        description: 'Pão italiano tostado com tomate, manjericão e azeite',
        price: 18.90,
        categoryId: '1',
        image: 'https://images.unsplash.com/photo-1572441713132-51c75654db73?w=200'
      },
      {
        id: '2',
        name: 'Carpaccio de Salmão',
        description: 'Fatias finas de salmão com alcaparras e molho especial',
        price: 32.90,
        categoryId: '1',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200'
      },
      {
        id: '3',
        name: 'Salmão Grelhado',
        description: 'Salmão fresco grelhado com legumes salteados',
        price: 45.90,
        categoryId: '2',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200'
      },
      {
        id: '4',
        name: 'Risotto de Camarão',
        description: 'Risotto cremoso com camarões frescos e açafrão',
        price: 52.90,
        categoryId: '2',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200'
      },
      {
        id: '5',
        name: 'Tiramisu',
        description: 'Sobremesa italiana tradicional com café e mascarpone',
        price: 16.90,
        categoryId: '3',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=200'
      },
      {
        id: '6',
        name: 'Suco Natural',
        description: 'Suco de frutas frescas da estação',
        price: 8.90,
        categoryId: '4',
        image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=200'
      }
    ]);

    const currentOrder = ref<Order>({
      items: [],
      notes: ''
    });

    const activeOrders = ref([
      { id: '1', table: 2, status: 'preparing' },
      { id: '2', table: 7, status: 'ready' }
    ]);

    const readyOrders = ref<ReadyOrder[]>([
      {
        id: 'ready-1',
        table: 4,
        items: [
          { id: '1', name: 'Salmão Grelhado', price: 45.90, quantity: 1 },
          { id: '2', name: 'Bruschetta Italiana', price: 18.90, quantity: 2 }
        ],
        readyAt: new Date(Date.now() - 300000) // Pronto há 5 minutos
      },
      {
        id: 'ready-2',
        table: 8,
        items: [
          { id: '3', name: 'Risotto de Camarão', price: 52.90, quantity: 1 },
          { id: '4', name: 'Tiramisu', price: 16.90, quantity: 1 }
        ],
        readyAt: new Date(Date.now() - 120000) // Pronto há 2 minutos
      }
    ]);

    // Computed
    const filteredTables = computed(() => {
      if (tableFilter.value === 'all') return tables.value;
      if (tableFilter.value === 'available') {
        return tables.value.filter(table => table.status === 'available');
      }
      if (tableFilter.value === 'occupied') {
        return tables.value.filter(table => table.status === 'occupied');
      }
      return tables.value;
    });

    const filteredProducts = computed(() => {
      return products.value.filter(product => product.categoryId === selectedCategory.value);
    });

    const orderSubtotal = computed(() => {
      return currentOrder.value.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
    });

    // Methods
    const selectTable = (table: Table) => {
      selectedTable.value = table;
      // Limpar pedido atual quando selecionar uma nova mesa
      currentOrder.value = { items: [], notes: '' };
    };

    const getTableStatusText = (status: string) => {
      const statusMap = {
        available: 'Livre',
        occupied: 'Ocupada',
        reserved: 'Reservada'
      };
      return statusMap[status as keyof typeof statusMap] || status;
    };

    const formatTime = (date: Date) => {
      const diff = Date.now() - date.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    };

    const addToOrder = (product: Product) => {
      const existingItem = currentOrder.value.items.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity++;
      } else {
        currentOrder.value.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        });
      }
    };

    const removeFromOrder = (item: OrderItem) => {
      const index = currentOrder.value.items.indexOf(item);
      if (index > -1) {
        currentOrder.value.items.splice(index, 1);
      }
    };

    const increaseQuantity = (item: OrderItem) => {
      item.quantity++;
    };

    const decreaseQuantity = (item: OrderItem) => {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        removeFromOrder(item);
      }
    };

    const clearOrder = () => {
      currentOrder.value = { items: [], notes: '' };
    };

    const sendOrder = () => {
      showConfirmModal.value = true;
    };

    const confirmOrder = () => {
      // Simular envio do pedido
      console.log('Pedido enviado para a mesa', selectedTable.value?.number);
      console.log('Itens:', currentOrder.value.items);
      console.log('Observações:', currentOrder.value.notes);
      
      // Limpar pedido e modal
      currentOrder.value = { items: [], notes: '' };
      showConfirmModal.value = false;
      
      // Simular atualização da mesa
      if (selectedTable.value) {
        selectedTable.value.hasOrders = true;
        selectedTable.value.ordersCount = (selectedTable.value.ordersCount || 0) + 1;
      }
      
      alert('Pedido enviado com sucesso!');
    };

    const formatReadyTime = (readyAt: Date) => {
      const diff = Date.now() - readyAt.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      
      if (minutes < 60) {
        return `${minutes}min`;
      }
      
      const hours = Math.floor(minutes / 60);
      return `${hours}h ${minutes % 60}min`;
    };

    const markAsDelivered = (order: ReadyOrder) => {
      const index = readyOrders.value.findIndex(o => o.id === order.id);
      if (index > -1) {
        readyOrders.value.splice(index, 1);
      }
      
      // Simular atualização do status na mesa
      const table = tables.value.find(t => t.number === order.table);
      if (table && table.ordersCount) {
        table.ordersCount--;
        if (table.ordersCount === 0) {
          table.hasOrders = false;
        }
      }
      
      console.log(`Pedido da Mesa ${order.table} marcado como entregue`);
    };

    const clearAllNotifications = () => {
      readyOrders.value.forEach(order => {
        const table = tables.value.find(t => t.number === order.table);
        if (table && table.ordersCount) {
          table.ordersCount--;
          if (table.ordersCount === 0) {
            table.hasOrders = false;
          }
        }
      });
      
      readyOrders.value = [];
      console.log('Todos os pedidos marcados como entregues');
    };

    const simulateNewReadyOrder = () => {
      const availableTables = [1, 3, 5, 6];
      const randomTable = availableTables[Math.floor(Math.random() * availableTables.length)];
      
      const sampleItems = [
        { id: Date.now().toString(), name: 'Prato do Dia', price: 35.90, quantity: 1 },
        { id: (Date.now() + 1).toString(), name: 'Refrigerante', price: 6.90, quantity: 2 }
      ];
      
      const newOrder: ReadyOrder = {
        id: `ready-${Date.now()}`,
        table: randomTable,
        items: sampleItems,
        readyAt: new Date()
      };
      
      readyOrders.value.push(newOrder);
      
      // Atualizar mesa
      const table = tables.value.find(t => t.number === randomTable);
      if (table) {
        table.hasOrders = true;
        table.ordersCount = (table.ordersCount || 0) + 1;
      }
      
      console.log(`Novo pedido pronto simulado para Mesa ${randomTable}`);
    };

    return {
      waiterName,
      tableFilter,
      selectedTable,
      selectedCategory,
      showConfirmModal,
      tables,
      categories,
      products,
      currentOrder,
      activeOrders,
      readyOrders,
      filteredTables,
      filteredProducts,
      orderSubtotal,
      selectTable,
      getTableStatusText,
      formatTime,
      addToOrder,
      removeFromOrder,
      increaseQuantity,
      decreaseQuantity,
      clearOrder,
      sendOrder,
      confirmOrder,
      formatReadyTime,
      markAsDelivered,
      clearAllNotifications,
      simulateNewReadyOrder
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
  gap: 2rem;
  align-items: center;
}

.active-orders, .waiter-info, .ready-notifications {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  color: #4a5568;
  font-weight: 500;
}

.active-orders i {
  color: #1a73e8;
}

.ready-notifications {
  background: #fed7d7;
  color: #742a2a;
  animation: pulse 2s infinite;
}

.ready-notifications i {
  color: #e53e3e;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.waiter-info i {
  color: #38a169;
}

/* Layout principal */
.waiter-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  height: calc(100vh - 200px);
}

/* Notificações de Pedidos Prontos */
.ready-orders-section {
  background: #fed7d7;
  border: 2px solid #e53e3e;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.notification-header h3 {
  color: #742a2a;
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.notification-header h3 i {
  color: #e53e3e;
  animation: ring 2s infinite;
}

@keyframes ring {
  0%, 100% { transform: rotate(0deg); }
  10%, 30% { transform: rotate(-10deg); }
  20% { transform: rotate(10deg); }
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.ready-orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ready-order-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #e53e3e;
}

.ready-order-info {
  flex: 1;
}

.table-info h4 {
  color: #1a202c;
  margin: 0 0 0.25rem;
  font-size: 1.125rem;
  font-weight: 600;
}

.ready-time {
  color: #e53e3e;
  font-size: 0.875rem;
  font-weight: 500;
}

.order-items-summary {
  margin-top: 0.5rem;
}

.items-count {
  display: inline-block;
  background: #1a73e8;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.items-preview {
  font-size: 0.875rem;
  color: #4a5568;
  line-height: 1.4;
}

.ready-order-actions {
  margin-left: 1rem;
}

/* Seção de mesas */
.tables-section {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.tables-filter {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 0.375rem;
  font-size: 0.875rem;
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

.tables-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.table-card {
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  text-align: center;
}

.table-card:hover {
  border-color: #1a73e8;
  background: #ebf8ff;
}

.table-card.selected {
  border-color: #1a73e8;
  background: #ebf8ff;
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
}

.table-card.occupied {
  background: #fff5f5;
  border-color: #feb2b2;
}

.table-card.occupied:hover,
.table-card.occupied.selected {
  border-color: #e53e3e;
  background: #fed7d7;
}

.table-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.table-status {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.table-status.available {
  color: #38a169;
}

.table-status.occupied {
  color: #e53e3e;
}

.table-status.reserved {
  color: #d69e2e;
}

.table-details {
  font-size: 0.75rem;
  color: #718096;
}

.orders-indicator {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background: #1a73e8;
  color: white;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Seção do pedido */
.order-section {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.order-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.order-actions {
  display: flex;
  gap: 1rem;
}

.order-content {
  flex: 1;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

/* Menu de produtos */
.menu-section {
  display: flex;
  flex-direction: column;
}

.menu-categories {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.category-btn {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 0.375rem;
  font-weight: 500;
  color: #718096;
  cursor: pointer;
  transition: all 0.2s;
}

.category-btn:hover {
  border-color: #1a73e8;
  color: #1a73e8;
}

.category-btn.active {
  background: #1a73e8;
  border-color: #1a73e8;
  color: white;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  overflow-y: auto;
  max-height: 400px;
}

.product-item {
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.product-item:hover {
  border-color: #1a73e8;
  background: #ebf8ff;
}

.product-image {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 0.375rem;
  margin-bottom: 0.75rem;
}

.product-info h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.25rem;
}

.product-description {
  font-size: 0.75rem;
  color: #718096;
  margin: 0 0 0.5rem;
  line-height: 1.4;
}

.product-price {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1a73e8;
}

.add-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  background: #1a73e8;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

/* Resumo do pedido */
.order-summary {
  display: flex;
  flex-direction: column;
}

.order-summary h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 1rem;
}

.order-items {
  flex: 1;
  overflow-y: auto;
  max-height: 300px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.item-info {
  flex: 1;
}

.item-name {
  display: block;
  font-weight: 500;
  color: #1a202c;
  font-size: 0.875rem;
}

.item-price {
  display: block;
  color: #718096;
  font-size: 0.75rem;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.qty-btn {
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.75rem;
  color: #718096;
}

.qty-btn:hover {
  border-color: #1a73e8;
  color: #1a73e8;
}

.quantity {
  font-weight: 600;
  color: #1a202c;
  min-width: 1.5rem;
  text-align: center;
}

.remove-btn {
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  background: #fed7d7;
  color: #e53e3e;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.75rem;
}

.remove-btn:hover {
  background: #feb2b2;
}

.empty-order {
  text-align: center;
  padding: 2rem;
  color: #a0aec0;
}

.empty-order i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.order-total {
  margin: 1rem 0;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.total-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.total-line.final {
  font-weight: 700;
  color: #1a202c;
  font-size: 1.125rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
}

.order-notes {
  margin-top: 1rem;
}

.order-notes label {
  display: block;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.order-notes textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.375rem;
  resize: vertical;
  font-family: inherit;
}

.order-notes textarea:focus {
  outline: none;
  border-color: #1a73e8;
}

/* Seleção de mesa */
.no-table-selected {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #a0aec0;
  height: 100%;
}

.no-table-selected i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-table-selected h3 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
}

.no-table-selected p {
  margin: 0;
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
  font-size: 0.875rem;
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
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
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

.confirm-details h4 {
  color: #1a202c;
  margin: 0 0 1rem;
}

.confirm-items {
  margin-bottom: 1rem;
}

.confirm-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.confirm-total {
  text-align: right;
  font-size: 1.125rem;
  color: #1a202c;
  margin: 1rem 0;
  padding-top: 1rem;
  border-top: 2px solid #e2e8f0;
}

.confirm-notes {
  margin-top: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 0.375rem;
}

.confirm-notes strong {
  color: #1a202c;
  display: block;
  margin-bottom: 0.5rem;
}

.confirm-notes p {
  margin: 0;
  color: #4a5568;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

/* Responsividade */
@media (max-width: 1200px) {
  .waiter-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .order-content {
    grid-template-columns: 1fr;
    gap: 1rem;
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
  }
  
  .ready-orders-section {
    margin-bottom: 1rem;
  }
  
  .notification-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .ready-order-card {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .ready-order-actions {
    margin-left: 0;
  }
  
  .tables-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>
