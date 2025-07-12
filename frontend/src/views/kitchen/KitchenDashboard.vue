<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Cabeçalho -->
    <KitchenHeader 
      :status-filter.sync="statusFilter"
      :priority-filter.sync="priorityFilter"
      :view-mode.sync="viewMode"
      :stats="stats"
      @refresh="refreshOrders"
      @toggle-notifications="toggleNotifications"
      @toggle-user-menu="toggleUserMenu"
      @logout="logout"
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Estatísticas Rápidas -->
      <KitchenStats :stats="stats" />
      
      <!-- Fila de Pedidos -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">Fila de Pedidos</h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">Acompanhe o andamento dos pedidos</p>
            </div>
            <div class="flex space-x-3">
              <!-- Filtro de Prioridade -->
              <div class="relative">
                <select 
                  v-model="priorityFilter"
                  class="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">Todas as prioridades</option>
                  <option value="high">Alta prioridade</option>
                  <option value="normal">Prioridade normal</option>
                  <option value="low">Baixa prioridade</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <!-- Botão de Atualizar -->
              <button 
                @click="refreshOrders"
                class="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                :class="{ 'animate-spin': isRefreshing }"
                :disabled="isRefreshing"
                title="Atualizar pedidos"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              
              <!-- Botão de Modo de Visualização -->
              <button 
                @click="toggleViewMode"
                class="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                :title="viewMode === 'grid' ? 'Visualização em lista' : 'Visualização em grade'"
              >
                <svg v-if="viewMode === 'grid'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Conteúdo dos Pedidos -->
        <div class="p-4">
          <OrderGrid 
            v-if="viewMode === 'grid'" 
            :orders="filteredOrders" 
            :selected-order-id="selectedOrderId"
            @select-order="selectOrder"
            @start-preparing-order="startPreparingOrder"
            @start-preparing-item="startPreparingItem"
            @mark-item-as-ready="markItemAsReady"
            @mark-order-as-ready="markOrderAsReady"
            @notify-order-ready="notifyOrderReady"
            @view-order-details="viewOrderDetails"
          />
          
          <OrderList 
            v-else 
            :orders="filteredOrders" 
            :selected-order-id="selectedOrderId"
            @select-order="selectOrder"
            @start-preparing-order="startPreparingOrder"
            @start-preparing-item="startPreparingItem"
            @mark-item-as-ready="markItemAsReady"
            @mark-order-as-ready="markOrderAsReady"
            @notify-order-ready="notifyOrderReady"
            @view-order-details="viewOrderDetails"
          />
          
          <!-- Estado vazio -->
          <div 
            v-if="filteredOrders.length === 0"
            class="py-12 text-center"
          >
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum pedido encontrado</h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ statusFilter === 'all' ? 'Não há pedidos no momento' : `Não há pedidos com status "${getStatusText(statusFilter || '')}"` }}
            </p>
            <div class="mt-6">
              <button
                type="button"
                @click="resetFilters"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                </svg>
                Limpar filtros
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Modal de Detalhes do Pedido -->
    <OrderDetailsModal 
      v-if="selectedOrder"
      :order="selectedOrder"
      :is-open="isOrderModalOpen"
      @close="closeOrderModal"
      @update:order="updateOrder"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import KitchenHeader from '../../components/kitchen/KitchenHeader.vue';
import KitchenStats from '../../components/kitchen/KitchenStats.vue';
import OrderGrid from '../../components/kitchen/OrderGrid.vue';
import OrderList from '../../components/kitchen/OrderList.vue';
import OrderDetailsModal from '../../components/kitchen/OrderDetailsModal.vue';
import { Order, OrderStatus, OrderItemStatus } from '@/types/order';

export default defineComponent({
  name: 'KitchenDashboard',
  components: {
    KitchenHeader,
    KitchenStats,
    OrderGrid,
    OrderList,
    OrderDetailsModal
  },
  setup() {
    const router = useRouter();
    
    // Estado
    const statusFilter = ref<OrderStatus | 'all'>('all');
    const priorityFilter = ref<'all' | 'high' | 'normal' | 'low'>('all');
    const viewMode = ref<'grid' | 'list'>('grid');
    const isRefreshing = ref(false);
    const selectedOrderId = ref<string | null>(null);
    const selectedOrder = ref<Order | null>(null);
    const isOrderModalOpen = ref(false);
    const showUserMenu = ref(false);
    const showNotifications = ref(false);
    
    // Dados de exemplo - em um cenário real, isso viria de uma API
    const orders = ref<Order[]>([]); // Initialize with empty array
    
    // Estatísticas
    const stats = computed(() => {
      const pending = orders.value.filter((o: Order) => o.status === 'pending').length;
      const preparing = orders.value.filter((o: Order) => o.status === 'preparing').length;
      const ready = orders.value.filter((o: Order) => o.status === 'ready').length;
      const totalTime = orders.value
        .filter((o: Order) => o.status === 'delivered' && o.preparationTime)
        .reduce((sum: number, order: Order) => sum + (order.preparationTime || 0), 0);
      const deliveredOrders = orders.value.filter((o: Order) => o.status === 'delivered' && o.preparationTime);
      const avgTime = deliveredOrders.length > 0 
        ? Math.round(totalTime / deliveredOrders.length)
        : 0;
      
      return {
        pendingOrders: pending,
        preparingOrders: preparing,
        readyOrders: ready,
        averageTime: avgTime,
        totalOrders: orders.value.length
      };
    });
    
    // Pedidos filtrados
    const filteredOrders = computed(() => {
      return orders.value.filter(order => {
        const matchesStatus = statusFilter.value === 'all' || order.status === statusFilter.value;
        const matchesPriority = priorityFilter.value === 'all' || order.priority === priorityFilter.value;
        return matchesStatus && matchesPriority;
      }).sort((a, b) => {
        // Ordena por prioridade e depois por tempo de espera
        const priorityOrder = { high: 3, normal: 2, low: 1 };
        const aPriority = priorityOrder[a.priority] || 0;
        const bPriority = priorityOrder[b.priority] || 0;
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
    });
    
    // Métodos
    const refreshOrders = async () => {
      isRefreshing.value = true;
      // Simula uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      isRefreshing.value = false;
    };
    
    const toggleViewMode = () => {
      viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid';
      // Salvar preferência no localStorage
      localStorage.setItem('kitchenViewMode', viewMode.value);
    };
    
    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value;
    };
    
    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
    };
    
    const logout = () => {
      // Implementar lógica de logout
      router.push('/auth/login');
    };
    
    const resetFilters = () => {
      statusFilter.value = 'all';
      priorityFilter.value = 'all';
    };
    
    const selectOrder = (order: Order) => {
      selectedOrderId.value = order.id;
      selectedOrder.value = { ...order };
      isOrderModalOpen.value = true;
    };
    
    const closeOrderModal = () => {
      isOrderModalOpen.value = false;
      setTimeout(() => {
        selectedOrder.value = null;
      }, 300);
    };
    
    const updateOrder = (updatedOrder: Order) => {
      const index = orders.value.findIndex(o => o.id === updatedOrder.id);
      if (index !== -1) {
        orders.value[index] = { ...updatedOrder };
      }
      closeOrderModal();
    };
    
    const startPreparingOrder = (orderId: string) => {
      const order = orders.value.find(o => o.id === orderId);
      if (order) {
        order.status = 'preparing';
        order.items.forEach(item => {
          if (item.status === 'pending') {
            item.status = 'preparing';
          }
        });
        order.updatedAt = new Date().toISOString();
      }
    };
    
    const startPreparingItem = (orderId: string, itemId: string) => {
      const order = orders.value.find(o => o.id === orderId);
      if (order) {
        const item = order.items.find(i => i.id === itemId);
        if (item) {
          item.status = 'preparing';
          order.updatedAt = new Date().toISOString();
          
          // Se todos os itens estiverem em preparo, atualiza o status do pedido
          if (order.items.every(i => i.status !== 'pending')) {
            order.status = 'preparing';
          }
        }
      }
    };
    
    const markItemAsReady = (orderId: string, itemId: string) => {
      const order = orders.value.find(o => o.id === orderId);
      if (order) {
        const item = order.items.find(i => i.id === itemId);
        if (item) {
          item.status = 'ready';
          item.completedAt = new Date().toISOString();
          order.updatedAt = new Date().toISOString();
          
          // Se todos os itens estiverem prontos, atualiza o status do pedido
          if (order.items.every(i => i.status === 'ready')) {
            order.status = 'ready';
            order.completedAt = new Date().toISOString();
          }
        }
      }
    };
    
    const markOrderAsReady = (orderId: string) => {
      const order = orders.value.find(o => o.id === orderId);
      if (order && isOrderReady(order)) {
        order.status = 'ready';
        order.completedAt = new Date().toISOString();
        order.updatedAt = new Date().toISOString();
      }
    };
    
    const notifyOrderReady = (orderId: string) => {
      const order = orders.value.find(o => o.id === orderId);
      if (order) {
        order.status = 'delivered';
        order.deliveredAt = new Date().toISOString();
        order.updatedAt = new Date().toISOString();
        
        // Em um cenário real, aqui seria feita uma notificação para o garçom
        console.log(`Pedido #${order.id} pronto para entrega!`);
      }
    };
    
    const viewOrderDetails = (order: Order) => {
      selectOrder(order);
    };
    
    const isOrderReady = (order: Order): boolean => {
      return order.items.every(item => item.status === 'ready');
    };
    
    const getStatusText = (status: string): string => {
      const statusMap: Record<string, string> = {
        'pending': 'Pendente',
        'preparing': 'Em preparo',
        'ready': 'Pronto',
        'delivered': 'Entregue',
        'delayed': 'Atrasado'
      };
      return statusMap[status] || status;
    };
    
    // Carregar preferências ao montar o componente
    onMounted(() => {
      const savedViewMode = localStorage.getItem('kitchenViewMode');
      if (savedViewMode === 'grid' || savedViewMode === 'list') {
        viewMode.value = savedViewMode;
      }
    });
    
    return {
      // Refs
      statusFilter,
      priorityFilter,
      viewMode,
      isRefreshing,
      selectedOrderId,
      selectedOrder,
      isOrderModalOpen,
      showUserMenu,
      showNotifications,
      
      // Computed
      stats,
      filteredOrders,
      
      // Methods
      refreshOrders,
      toggleViewMode,
      toggleUserMenu,
      toggleNotifications,
      logout,
      resetFilters,
      selectOrder,
      closeOrderModal,
      updateOrder,
      startPreparingOrder,
      startPreparingItem,
      markItemAsReady,
      markOrderAsReady,
      notifyOrderReady,
      viewOrderDetails,
      isOrderReady,
      getStatusText
    };
  }
});
</script>
