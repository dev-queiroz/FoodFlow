<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <!-- Logo e Nome do Restaurante -->
      <div class="flex items-center">
        <div class="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h1 class="ml-3 text-xl font-bold text-gray-900">Restaurante Sabor & Arte</h1>
      </div>

      <!-- Menu de Navegação -->
      <nav class="hidden md:flex space-x-8">
        <router-link 
          to="/waiter" 
          class="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-primary text-sm font-medium"
          active-class="border-primary text-gray-900"
          exact
        >
          Painel
        </router-link>
        <router-link 
          to="/waiter/orders" 
          class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          active-class="border-primary text-gray-900"
        >
          Pedidos
          <span v-if="pendingOrdersCount > 0" class="ml-1.5 py-0.5 px-1.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {{ pendingOrdersCount }}
          </span>
        </router-link>
        <router-link 
          to="/waiter/tables" 
          class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          active-class="border-primary text-gray-900"
        >
          Mesas
        </router-link>
        <router-link 
          to="/waiter/menu" 
          class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          active-class="border-primary text-gray-900"
        >
          Cardápio
        </router-link>
      </nav>

      <!-- Botões de Ação -->
      <div class="flex items-center space-x-4">
        <!-- Botão de Notificações -->
        <div class="relative">
          <button 
            @click="toggleNotifications"
            class="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 relative"
            aria-label="Notificações"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span 
              v-if="unreadNotifications > 0"
              class="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            >
              {{ unreadNotifications }}
            </span>
          </button>
          
          <!-- Dropdown de Notificações -->
          <transition
            enter-active-class="transition ease-out duration-100 transform"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75 transform"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div 
              v-show="showNotifications"
              class="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 divide-y divide-gray-200"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="notifications-menu"
            >
              <div class="px-4 py-3 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-900">Notificações</p>
                  <button 
                    v-if="unreadNotifications > 0"
                    @click="markAllAsRead"
                    class="text-xs text-primary-600 hover:text-primary-800"
                  >
                    Marcar todas como lidas
                  </button>
                </div>
              </div>
              
              <div class="max-h-96 overflow-y-auto">
                <div 
                  v-for="notification in notifications" 
                  :key="notification.id"
                  @click="handleNotificationClick(notification)"
                  class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                  :class="{ 'bg-blue-50': !notification.read }"
                >
                  <div class="flex items-start">
                    <div class="flex-shrink-0 pt-0.5">
                      <div 
                        class="h-8 w-8 rounded-full flex items-center justify-center"
                        :class="getNotificationIconClass(notification.type)"
                      >
                        <component :is="getNotificationIcon(notification.type)" class="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div class="ml-3 flex-1">
                      <p class="text-sm font-medium text-gray-900">
                        {{ notification.title }}
                      </p>
                      <p class="text-sm text-gray-500">
                        {{ notification.message }}
                      </p>
                      <p class="mt-1 text-xs text-gray-400">
                        {{ formatTimeAgo(notification.time) }}
                      </p>
                    </div>
                    <div class="ml-4 flex-shrink-0">
                      <button 
                        v-if="!notification.read"
                        @click.stop="markAsRead(notification.id)"
                        class="text-gray-400 hover:text-gray-500"
                        title="Marcar como lida"
                      >
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div v-if="notifications.length === 0" class="px-4 py-8 text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <p class="mt-1 text-sm text-gray-500">Nenhuma notificação</p>
                </div>
              </div>
              
              <div class="px-4 py-2 bg-gray-50 text-center">
                <router-link 
                  to="/waiter/notifications" 
                  class="text-sm font-medium text-primary-600 hover:text-primary-500"
                  @click="showNotifications = false"
                >
                  Ver todas as notificações
                </router-link>
              </div>
            </div>
          </transition>
        </div>
        
        <!-- Menu de Perfil -->
        <div class="relative">
          <button 
            @click="toggleProfileMenu"
            class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            id="user-menu"
            aria-expanded="false"
            aria-haspopup="true"
          >
            <span class="sr-only">Abrir menu do usuário</span>
            <div class="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium">
              {{ userInitials }}
            </div>
            <span class="hidden md:inline-block ml-2 text-sm font-medium text-gray-700">{{ userName }}</span>
            <svg class="hidden md:block ml-1 h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <!-- Dropdown do Perfil -->
          <transition
            enter-active-class="transition ease-out duration-100 transform"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75 transform"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div 
              v-show="showProfileMenu"
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 divide-y divide-gray-100"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              <div class="py-1">
                <div class="px-4 py-2">
                  <p class="text-sm text-gray-700">Logado como</p>
                  <p class="text-sm font-medium text-gray-900 truncate">{{ userEmail }}</p>
                </div>
              </div>
              <div class="py-1">
                <router-link 
                  to="/waiter/profile" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  @click="showProfileMenu = false"
                >
                  Meu Perfil
                </router-link>
                <router-link 
                  to="/waiter/settings" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  @click="showProfileMenu = false"
                >
                  Configurações
                </router-link>
              </div>
              <div class="py-1">
                <button 
                  @click="logout"
                  class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  role="menuitem"
                >
                  Sair
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
    
    <!-- Menu Mobile -->
    <div class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <router-link 
          to="/waiter" 
          class="bg-gray-100 text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
          active-class="bg-primary-50 text-primary-700"
          exact
        >
          Painel
        </router-link>
        <router-link 
          to="/waiter/orders" 
          class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
          active-class="bg-primary-50 text-primary-700"
        >
          Pedidos
          <span v-if="pendingOrdersCount > 0" class="ml-1.5 py-0.5 px-1.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {{ pendingOrdersCount }}
          </span>
        </router-link>
        <router-link 
          to="/waiter/tables" 
          class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
          active-class="bg-primary-50 text-primary-700"
        >
          Mesas
        </router-link>
        <router-link 
          to="/waiter/menu" 
          class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
          active-class="bg-primary-50 text-primary-700"
        >
          Cardápio
        </router-link>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { BellIcon, MenuIcon, XIcon, CheckIcon, UserIcon, CogIcon, LogoutIcon, HomeIcon, ShoppingCartIcon, TableIcon, MenuAlt1Icon } from '@heroicons/vue/outline';

export default defineComponent({
  name: 'WaiterHeader',
  components: {
    BellIcon,
    MenuIcon,
    XIcon,
    CheckIcon,
    UserIcon,
    CogIcon,
    LogoutIcon,
    HomeIcon,
    ShoppingCartIcon,
    TableIcon,
    MenuAlt1Icon
  },
  props: {
    unreadNotifications: {
      type: Number,
      default: 0
    },
    notifications: {
      type: Array,
      default: () => []
    },
    pendingOrdersCount: {
      type: Number,
      default: 0
    }
  },
  emits: ['mark-as-read', 'toggle-notifications'],
  setup(props, { emit }) {
    const router = useRouter();
    const showNotifications = ref(false);
    const showProfileMenu = ref(false);
    
    // Dados do usuário (em um cenário real, isso viria de uma store ou API)
    const user = ref({
      name: 'João Garçom',
      email: 'joao.garcom@restaurante.com',
      role: 'Garçom',
      avatar: null
    });
    
    // Computed
    const userInitials = computed(() => {
      return user.value.name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    });
    
    const userName = computed(() => user.value.name);
    const userEmail = computed(() => user.value.email);
    
    // Métodos
    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
      if (showProfileMenu.value) showProfileMenu.value = false;
      emit('toggle-notifications');
    };
    
    const toggleProfileMenu = () => {
      showProfileMenu.value = !showProfileMenu.value;
      if (showNotifications.value) showNotifications.value = false;
    };
    
    const markAsRead = (id: string) => {
      emit('mark-as-read', id);
    };
    
    const markAllAsRead = () => {
      props.notifications.forEach(notification => {
        if (!notification.read) {
          markAsRead(notification.id);
        }
      });
    };
    
    const handleNotificationClick = (notification: any) => {
      // Marcar como lida ao clicar
      if (!notification.read) {
        markAsRead(notification.id);
      }
      
      // Navegar para a rota apropriada com base no tipo de notificação
      switch (notification.type) {
        case 'order':
          router.push(`/waiter/orders/${notification.referenceId}`);
          break;
        case 'table':
          router.push(`/waiter/tables/${notification.referenceId}`);
          break;
        default:
          break;
      }
      
      // Fechar o dropdown
      showNotifications.value = false;
    };
    
    const getNotificationIcon = (type: string) => {
      const icons: Record<string, any> = {
        success: 'CheckIcon',
        error: 'XIcon',
        warning: 'XIcon',
        info: 'XIcon',
        order: 'ShoppingCartIcon',
        table: 'TableIcon',
        payment: 'XIcon'
      };
      return icons[type] || 'BellIcon';
    };
    
    const getNotificationIconClass = (type: string) => {
      const classes: Record<string, string> = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500',
        order: 'bg-indigo-500',
        table: 'bg-purple-500',
        payment: 'bg-green-500'
      };
      return classes[type] || 'bg-gray-500';
    };
    
    const formatTimeAgo = (date: Date) => {
      const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
      
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
    
    const logout = () => {
      // Implementar lógica de logout
      console.log('Logout');
      router.push('/login');
    };
    
    // Fechar menus ao clicar fora
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (showNotifications.value && !target.closest('.relative > button') && !target.closest('.origin-top-right')) {
        showNotifications.value = false;
      }
      
      if (showProfileMenu.value && !target.closest('#user-menu') && !target.closest('.origin-top-right')) {
        showProfileMenu.value = false;
      }
    };
    
    // Lifecycle hooks
    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });
    
    return {
      // State
      showNotifications,
      showProfileMenu,
      
      // Computed
      userInitials,
      userName,
      userEmail,
      
      // Methods
      toggleNotifications,
      toggleProfileMenu,
      markAsRead,
      markAllAsRead,
      handleNotificationClick,
      getNotificationIcon,
      getNotificationIconClass,
      formatTimeAgo,
      logout
    };
  }
});
</script>
