<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Card de Pedido -->
    <div 
      v-for="order in orders" 
      :key="order.id"
      class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
      :class="{
        'border-yellow-300': order.priority === 'high',
        'border-red-500': order.status === 'delayed',
        'ring-2 ring-primary-500': selectedOrderId === order.id
      }"
    >
      <!-- Cabeçalho do Card -->
      <div 
        class="px-4 py-3 border-b flex justify-between items-center"
        :class="{
          'bg-yellow-50 border-yellow-200': order.priority === 'high',
          'bg-red-50 border-red-200': order.status === 'delayed',
          'bg-white': order.priority !== 'high' && order.status !== 'delayed' && order.status !== 'ready',
          'bg-green-50 border-green-200': order.status === 'ready'
        }"
      >
        <div>
          <h3 class="text-lg font-medium text-gray-900">Pedido #{{ order.id }}</h3>
          <p class="text-sm text-gray-500">Mesa {{ order.tableNumber }} • {{ order.timeAgo }}</p>
        </div>
        <div class="flex items-center">
          <span 
            v-if="order.priority === 'high'" 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-2"
          >
            Alta Prioridade
          </span>
          <span 
            v-else-if="order.priority === 'low'" 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2"
          >
            Baixa Prioridade
          </span>
          
          <span 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="{
              'bg-yellow-100 text-yellow-800': order.status === 'pending',
              'bg-blue-100 text-blue-800': order.status === 'preparing',
              'bg-green-100 text-green-800': order.status === 'ready',
              'bg-gray-100 text-gray-800': order.status === 'delivered',
              'bg-red-100 text-red-800': order.status === 'delayed'
            }"
          >
            {{ getStatusText(order.status) }}
          </span>
        </div>
      </div>
      
      <!-- Itens do Pedido -->
      <div class="divide-y divide-gray-200">
        <div 
          v-for="item in order.items" 
          :key="item.id"
          class="px-4 py-3 flex justify-between hover:bg-gray-50"
        >
          <div class="flex">
            <div class="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden bg-gray-100">
              <img 
                v-if="item.image" 
                :src="item.image" 
                :alt="item.name" 
                class="h-full w-full object-cover"
              >
              <div v-else class="h-full w-full flex items-center justify-center bg-gray-200 text-gray-400">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">{{ item.quantity }}x {{ item.name }}</p>
              <p class="text-sm text-gray-500">{{ item.notes || 'Sem observações' }}</p>
            </div>
          </div>
          <div class="flex items-center">
            <span 
              v-if="item.status === 'ready'"
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
            >
              Pronto
            </span>
            <button 
              v-else-if="order.status === 'pending'"
              @click="$emit('start-preparing-item', order.id, item.id)"
              class="p-1 text-gray-400 hover:text-green-600 focus:outline-none"
              title="Iniciar preparo"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button 
              v-else-if="item.status === 'preparing'"
              @click="$emit('mark-item-as-ready', order.id, item.id)"
              class="p-1 text-gray-400 hover:text-green-600 focus:outline-none"
              title="Marcar como pronto"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Rodapé do Card -->
      <div class="px-4 py-3 bg-gray-50 border-t flex justify-between items-center">
        <div class="text-sm text-gray-500">
          {{ order.items.length }} ite{{ order.items.length === 1 ? 'm' : 'ns' }}
        </div>
        <div class="flex space-x-2">
          <button 
            v-if="order.status === 'pending'"
            @click="$emit('start-preparing-order', order.id)"
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Iniciar Preparo
          </button>
          <button 
            v-else-if="order.status === 'preparing'"
            @click="$emit('mark-order-as-ready', order.id)"
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            :disabled="!isOrderReady(order)"
            :class="{ 'opacity-50 cursor-not-allowed': !isOrderReady(order) }"
          >
            Marcar como Pronto
          </button>
          <button 
            v-else-if="order.status === 'ready'"
            @click="$emit('notify-order-ready', order.id)"
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Notificar Entrega
          </button>
          
          <button 
            @click="$emit('view-order-details', order)"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Detalhes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Order } from '@/types/order';

export default defineComponent({
  name: 'OrderGrid',
  props: {
    orders: {
      type: Array as PropType<Order[]>,
      required: true
    },
    selectedOrderId: {
      type: String,
      default: null
    }
  },
  emits: [
    'select-order',
    'start-preparing-order',
    'start-preparing-item',
    'mark-item-as-ready',
    'mark-order-as-ready',
    'notify-order-ready',
    'view-order-details'
  ],
  setup() {
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

    return {
      isOrderReady,
      getStatusText
    };
  }
});
</script>
