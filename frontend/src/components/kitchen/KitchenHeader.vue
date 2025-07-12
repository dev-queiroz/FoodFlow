<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <div class="flex items-center">
        <div class="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h1 class="ml-3 text-xl font-bold text-gray-900">Cozinha</h1>
      </div>
      
      <!-- Filtros e controles -->
      <div class="flex items-center space-x-4">
        <!-- Filtro de Status -->
        <div class="relative">
          <select 
            :value="statusFilter"
            @change="$emit('update:statusFilter', $event.target.value)"
            class="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Todos os pedidos</option>
            <option value="pending">Pendentes</option>
            <option value="preparing">Em preparo</option>
            <option value="ready">Prontos</option>
            <option value="delivered">Entregues</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        
        <!-- Botão de Atualizar -->
        <button 
          @click="$emit('refresh')"
          class="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          :class="{ 'animate-spin': isRefreshing }"
          :disabled="isRefreshing"
          title="Atualizar pedidos"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        
        <!-- Notificações -->
        <div class="relative">
          <button 
            @click="$emit('toggle-notifications')"
            class="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 relative"
            aria-label="Notificações"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span 
              v-if="unreadNotifications > 0"
              class="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            >
              {{ unreadNotifications }}
            </span>
          </button>
        </div>
        
        <!-- Perfil do Usuário -->
        <div class="relative">
          <button 
            @click="$emit('toggle-user-menu')"
            class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            id="user-menu"
            aria-expanded="false"
            aria-haspopup="true"
          >
            <span class="sr-only">Abrir menu do usuário</span>
            <div class="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium">
              {{ userInitials }}
            </div>
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
              v-show="showUserMenu"
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 divide-y divide-gray-100"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              <div class="py-1">
                <div class="px-4 py-2">
                  <p class="text-sm text-gray-700">Logado como</p>
                  <p class="text-sm font-medium text-gray-900 truncate">{{ user.email }}</p>
                </div>
              </div>
              <div class="py-1">
                <a 
                  href="#" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Meu Perfil
                </a>
                <a 
                  href="#" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Configurações
                </a>
              </div>
              <div class="py-1">
                <button 
                  @click="$emit('logout')"
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
  </header>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'KitchenHeader',
  props: {
    statusFilter: {
      type: String,
      default: 'all'
    },
    isRefreshing: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: () => ({
        name: 'Usuário',
        email: 'usuario@exemplo.com',
        role: 'cozinheiro'
      })
    },
    unreadNotifications: {
      type: Number,
      default: 0
    },
    showUserMenu: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'update:statusFilter',
    'refresh',
    'toggle-notifications',
    'toggle-user-menu',
    'logout'
  ],
  setup(props) {
    // Iniciais do usuário para o avatar
    const userInitials = computed(() => {
      if (!props.user?.name) return 'U';
      return props.user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    });

    return {
      userInitials
    };
  }
});
</script>
