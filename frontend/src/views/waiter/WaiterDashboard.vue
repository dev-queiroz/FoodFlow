<template>
  <div class="min-h-screen bg-gray-100">
    <WaiterHeader 
      :unread-notifications="unreadNotifications"
      :notifications="notifications"
      @mark-as-read="markAsRead"
      @toggle-notifications="toggleNotifications"
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <DashboardStats :stats="stats" />
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <!-- Seção de Mesas -->
        <div class="lg:col-span-2">
          <TableList 
            :tables="tables" 
            :selected-table="selectedTable"
            :view-mode="viewMode"
            @select-table="selectTable"
            @toggle-view-mode="toggleViewMode"
          />
        </div>

        <!-- Seção de Pedidos Recentes e Ações Rápidas -->
        <div class="space-y-6">
          <RecentOrders 
            :orders="recentOrders" 
            @view-order="viewOrderDetails"
            @view-all-orders="viewAllOrders"
          />
          
          <QuickActions 
            @new-order="openNewOrderModal"
            @reserve-table="openTableReservationModal"
            @process-payment="openPaymentModal"
            @view-kitchen="openKitchenView"
          />
        </div>
      </div>
    </main>

    <!-- Modal de Detalhes da Mesa -->
    <TableDetailsModal 
      v-if="selectedTable"
      :table="selectedTable"
      :is-open="isTableModalOpen"
      @close="closeTableModal"
      @checkout="processCheckout"
    />

    <!-- Notificações -->
    <NotificationContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNotification } from '../../composables/useNotification';
import WaiterHeader from '../../components/waiter/WaiterHeader.vue';
import DashboardStats from '../../components/waiter/DashboardStats.vue';
import TableList from '../../components/waiter/TableList.vue';
import RecentOrders from '../../components/waiter/RecentOrders.vue';
import QuickActions from '../../components/waiter/QuickActions.vue';
import TableDetailsModal from '../../components/waiter/TableDetailsModal.vue';
import { Notification } from '@/types/notification';
import { Table } from '@/types/table';
import { Order } from '@/types/order';
import type { DashboardStatsData } from '@/types/dashboard';

export default defineComponent({
  name: 'WaiterDashboard',
  components: {
    WaiterHeader,
    DashboardStats,
    TableList,
    RecentOrders,
    QuickActions,
    TableDetailsModal
  },
  setup() {
    const router = useRouter();
    const { NotificationComponent: NotificationContainer } = useNotification();
    
    // Estado
    const viewMode = ref<'grid' | 'list'>('grid');
    const showNotifications = ref(false);
    const isTableModalOpen = ref(false);
    const selectedTable = ref<Table | null>(null);
    
    // Dados de exemplo
    const stats = ref<DashboardStatsData>({
      occupiedTables: 8,
      totalTables: 20,
      occupancyRate: 40,
      pendingOrders: 5,
      pendingOrdersChange: 25,
      readyOrders: 3,
      dailyRevenue: 1245.75,
      revenueChange: 12.5,
      ordersToday: 42,
      ordersChange: 5,
      averageRating: 4.7,
      totalRatings: 128
    });

    const tables = ref<Table[]>([
      { id: 1, number: 1, status: 'occupied', capacity: 4, occupiedSeats: 3, orderCount: 2 },
      { id: 2, number: 2, status: 'free', capacity: 6, orderCount: 0 },
      { id: 3, number: 3, status: 'reserved', capacity: 2, orderCount: 1 },
      { id: 4, number: 4, status: 'free', capacity: 4, orderCount: 0 },
      { id: 5, number: 5, status: 'occupied', capacity: 8, occupiedSeats: 6, orderCount: 3 },
      { id: 6, number: 6, status: 'free', capacity: 4, orderCount: 0 },
      { id: 7, number: 7, status: 'free', capacity: 2, orderCount: 0 },
      { id: 8, number: 8, status: 'occupied', capacity: 6, occupiedSeats: 4, orderCount: 1 },
    ]);

    const recentOrders = ref<Order[]>([
      { 
        id: 1001, 
        tableNumber: 5, 
        status: 'ready', 
        total: 89.90, 
        time: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos atrás
        items: [
          { id: 1, name: 'Pizza Margherita', quantity: 1, price: 45.90 },
          { id: 2, name: 'Refrigerante Lata', quantity: 2, price: 7.00 },
          { id: 3, name: 'Sobremesa do Chef', quantity: 1, price: 15.00 }
        ]
      },
      { 
        id: 1002, 
        tableNumber: 8, 
        status: 'preparing', 
        total: 65.50, 
        time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
        items: [
          { id: 4, name: 'Lasanha à Bolonhesa', quantity: 1, price: 42.50 },
          { id: 5, name: 'Suco Natural', quantity: 2, price: 10.00 }
        ]
      },
      { 
        id: 1003, 
        tableNumber: 1, 
        status: 'pending', 
        total: 32.90, 
        time: new Date(Date.now() - 45 * 60 * 1000), // 45 minutos atrás
        items: [
          { id: 6, name: 'Hambúrguer Artesanal', quantity: 1, price: 28.90 },
          { id: 5, name: 'Suco Natural', quantity: 1, price: 10.00 }
        ]
      }
    ]);

    const notifications = ref<Notification[]>([
      { 
        id: '1', 
        title: 'Novo pedido', 
        message: 'Mesa 5 fez um novo pedido', 
        type: 'info',
        time: new Date(Date.now() - 1000 * 60 * 5), // 5 minutos atrás
        read: false
      },
      { 
        id: '2', 
        title: 'Pedido pronto', 
        message: 'Pedido #1001 está pronto para entrega', 
        type: 'success',
        time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
        read: false
      },
      { 
        id: '3', 
        title: 'Mesa liberada', 
        message: 'Mesa 3 foi liberada', 
        type: 'info',
        time: new Date(Date.now() - 1000 * 60 * 120), // 2 horas atrás
        read: true
      }
    ]);

    // Computed
    const unreadNotifications = computed(() => {
      return notifications.value.filter(n => !n.read).length;
    });

    // Métodos
    const toggleViewMode = () => {
      viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid';
    };

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
    };

    const markAsRead = (id: string) => {
      const notification = notifications.value.find(n => n.id === id);
      if (notification) {
        notification.read = true;
      }
    };

    const selectTable = (table: Table) => {
      selectedTable.value = table;
      isTableModalOpen.value = true;
    };

    const closeTableModal = () => {
      isTableModalOpen.value = false;
      // Limpa a mesa selecionada após a animação de fechamento
      setTimeout(() => {
        selectedTable.value = null;
      }, 300);
    };

    const processCheckout = (tableId: number) => {
      // Lógica para processar o checkout da mesa
      console.log(`Processando checkout da mesa ${tableId}`);
      closeTableModal();
      
      // Atualiza o status da mesa
      const table = tables.value.find(t => t.id === tableId);
      if (table) {
        table.status = 'free';
        table.occupiedSeats = 0;
        table.orderCount = 0;
      }
      
      // Mostra notificação de sucesso
      const { success } = useNotification();
      success('Checkout realizado com sucesso!');
    };

    const viewOrderDetails = (order: Order) => {
      console.log('Visualizando pedido:', order);
      // Navegar para a página de detalhes do pedido
      router.push(`/orders/${order.id}`);
    };

    const viewAllOrders = () => {
      router.push('/orders');
    };

    const openNewOrderModal = () => {
      console.log('Abrir modal de novo pedido');
      // Implementar lógica para abrir o modal de novo pedido
    };

    const openTableReservationModal = () => {
      console.log('Abrir modal de reserva de mesa');
      // Implementar lógica para abrir o modal de reserva
    };

    const openPaymentModal = () => {
      console.log('Abrir modal de pagamento');
      // Implementar lógica para abrir o modal de pagamento
    };

    const openKitchenView = () => {
      router.push('/kitchen');
    };

    // Formatação
    const formatCurrency = (value: number) => {
      return value.toFixed(2).replace('.', ',');
    };

    const formatTimeAgo = (date: Date) => {
      const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
      
      let interval = Math.floor(seconds / 31536000);
      if (interval >= 1) return `${interval} ano${interval === 1 ? '' : 's'} atrás`;
      
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) return `${interval} mês${interval === 1 ? '' : 'es'} atrás`;
      
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) return `${interval} dia${interval === 1 ? '' : 's'} atrás`;
      
      interval = Math.floor(seconds / 3600);
      if (interval >= 1) return `${interval} hora${interval === 1 ? '' : 's'} atrás`;
      
      interval = Math.floor(seconds / 60);
      if (interval >= 1) return `${interval} minuto${interval === 1 ? '' : 's'} atrás`;
      
      return 'Agora mesmo';
    };

    // Lifecycle hooks
    onMounted(() => {
      // Simular carregamento de dados da API
      console.log('Dashboard do garçom carregado');
    });

    return {
      // State
      viewMode,
      showNotifications,
      isTableModalOpen,
      selectedTable,
      stats,
      tables,
      recentOrders,
      notifications,
      
      // Computed
      unreadNotifications,
      
      // Methods
      toggleViewMode,
      toggleNotifications,
      markAsRead,
      selectTable,
      closeTableModal,
      processCheckout,
      viewOrderDetails,
      viewAllOrders,
      openNewOrderModal,
      openTableReservationModal,
      openPaymentModal,
      openKitchenView,
      formatCurrency,
      formatTimeAgo,
      
      // Components
      NotificationContainer
    };
  }
});
</script>
