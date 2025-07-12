<template>
  <transition
    enter-active-class="ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 overflow-hidden z-50">
      <div class="absolute inset-0 overflow-hidden">
        <!-- Overlay -->
        <div 
          class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          @click="close"
        ></div>
        
        <!-- Painel do Modal -->
        <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <transition
            enter-active-class="transform transition ease-in-out duration-500 sm:duration-700"
            enter-from-class="translate-x-full"
            enter-to-class="translate-x-0"
            leave-active-class="transform transition ease-in-out duration-500 sm:duration-700"
            leave-from-class="translate-x-0"
            leave-to-class="translate-x-full"
          >
            <div class="w-screen max-w-2xl">
              <div class="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                <!-- Cabeçalho -->
                <div class="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                  <div class="flex items-start justify-between">
                    <h2 class="text-lg font-medium text-gray-900">
                      {{ isNewTable ? 'Nova Mesa' : `Mesa ${table.number}` }}
                    </h2>
                    <div class="ml-3 h-7 flex items-center">
                      <button 
                        type="button" 
                        class="-m-2 p-2 text-gray-400 hover:text-gray-500"
                        @click="close"
                      >
                        <span class="sr-only">Fechar painel</span>
                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Conteúdo do Modal -->
                  <div class="mt-8">
                    <div class="space-y-6">
                      <!-- Número da Mesa -->
                      <div>
                        <label for="table-number" class="block text-sm font-medium text-gray-700">
                          Número da Mesa <span class="text-red-500">*</span>
                        </label>
                        <div class="mt-1">
                          <input
                            type="text"
                            id="table-number"
                            v-model="formData.number"
                            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            :class="{ 'border-red-300': errors.number }"
                          />
                          <p v-if="errors.number" class="mt-1 text-sm text-red-600">{{ errors.number }}</p>
                        </div>
                      </div>
                      
                      <!-- Status -->
                      <div>
                        <label for="table-status" class="block text-sm font-medium text-gray-700">
                          Status <span class="text-red-500">*</span>
                        </label>
                        <div class="mt-1">
                          <select
                            id="table-status"
                            v-model="formData.status"
                            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            :class="{ 'border-red-300': errors.status }"
                          >
                            <option value="available">Disponível</option>
                            <option value="occupied">Ocupada</option>
                            <option value="reserved">Reservada</option>
                            <option value="needs_attention">Precisa de Atenção</option>
                          </select>
                          <p v-if="errors.status" class="mt-1 text-sm text-red-600">{{ errors.status }}</p>
                        </div>
                      </div>
                      
                      <!-- Capacidade -->
                      <div>
                        <label for="table-capacity" class="block text-sm font-medium text-gray-700">
                          Capacidade <span class="text-red-500">*</span>
                        </label>
                        <div class="mt-1">
                          <input
                            type="number"
                            id="table-capacity"
                            v-model.number="formData.capacity"
                            min="1"
                            max="20"
                            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            :class="{ 'border-red-300': errors.capacity }"
                          />
                          <p v-if="errors.capacity" class="mt-1 text-sm text-red-600">{{ errors.capacity }}</p>
                        </div>
                      </div>
                      
                      <!-- Localização -->
                      <div>
                        <label for="table-location" class="block text-sm font-medium text-gray-700">
                          Localização
                        </label>
                        <div class="mt-1">
                          <select
                            id="table-location"
                            v-model="formData.location"
                            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          >
                            <option :value="undefined">Selecione uma área</option>
                            <option value="varanda">Varanda</option>
                            <option value="salao">Salão Principal</option>
                            <option value="area_externa">Área Externa</option>
                            <option value="mezanino">Mezanino</option>
                            <option value="privativo">Área Privativa</option>
                          </select>
                        </div>
                      </div>
                      
                      <!-- Garçom Responsável -->
                      <div v-if="formData.status === 'occupied' || formData.status === 'needs_attention'">
                        <label for="table-waiter" class="block text-sm font-medium text-gray-700">
                          Garçom Responsável
                        </label>
                        <div class="mt-1">
                          <select
                            id="table-waiter"
                            v-model="formData.waiter"
                            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          >
                            <option :value="undefined">Selecione um garçom</option>
                            <option value="João Silva">João Silva</option>
                            <option value="Maria Santos">Maria Santos</option>
                            <option value="Carlos Oliveira">Carlos Oliveira</option>
                            <option value="Ana Pereira">Ana Pereira</option>
                          </select>
                        </div>
                      </div>
                      
                      <!-- Pedido Atual -->
                      <div v-if="formData.currentOrder">
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                          Pedido Atual
                        </label>
                        <div class="bg-gray-50 p-3 rounded-md">
                          <div class="flex justify-between items-center">
                            <span class="font-medium">Pedido #{{ formData.currentOrder }}</span>
                            <span class="text-sm text-gray-500">{{ formData.orderTime || 'Aberto agora' }}</span>
                          </div>
                          <div class="mt-2">
                            <button
                              type="button"
                              class="text-sm text-primary-600 hover:text-primary-800"
                              @click="viewOrder"
                            >
                              Ver detalhes do pedido →
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Observações -->
                      <div>
                        <label for="table-notes" class="block text-sm font-medium text-gray-700">
                          Observações
                        </label>
                        <div class="mt-1">
                          <textarea
                            id="table-notes"
                            v-model="formData.notes"
                            rows="3"
                            class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full border border-gray-300 rounded-md sm:text-sm"
                            placeholder="Alergias, preferências, etc."
                          ></textarea>
                        </div>
                      </div>
                      
                      <!-- Ações Rápidas -->
                      <div v-if="!isNewTable" class="pt-4 border-t border-gray-200">
                        <h3 class="text-sm font-medium text-gray-700 mb-3">Ações Rápidas</h3>
                        <div class="grid grid-cols-2 gap-3">
                          <button
                            v-if="formData.status !== 'occupied'"
                            type="button"
                            class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            @click="startOrder"
                          >
                            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 01-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                            </svg>
                            Iniciar Pedido
                          </button>
                          
                          <button
                            v-if="formData.status === 'occupied'"
                            type="button"
                            class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            @click="viewOrder"
                          >
                            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                            </svg>
                            Ver Pedido
                          </button>
                          
                          <button
                            v-if="formData.status === 'occupied'"
                            type="button"
                            class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            @click="requestBill"
                          >
                            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                            </svg>
                            Solicitar Conta
                          </button>
                          
                          <button
                            v-if="formData.status !== 'needs_attention'"
                            type="button"
                            class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                            @click="markAsNeedsAttention"
                          >
                            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                            Pedir Ajuda
                          </button>
                          
                          <button
                            v-if="formData.status === 'needs_attention'"
                            type="button"
                            class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            @click="resolveAttention"
                          >
                            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                            Resolver
                          </button>
                        </div>
                      </div>
                      
                      <!-- Histórico de Atividades -->
                      <div v-if="!isNewTable" class="pt-4 border-t border-gray-200">
                        <h3 class="text-sm font-medium text-gray-700 mb-3">Histórico de Atividades</h3>
                        <div class="flow-root">
                          <ul class="-mb-8">
                            <li v-for="(activity, index) in activities" :key="index">
                              <div class="relative pb-8">
                                <span v-if="index !== activities.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                <div class="relative flex space-x-3">
                                  <div>
                                    <span :class="[activity.iconBackground, 'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white']">
                                      <component :is="activity.icon" class="h-5 w-5 text-white" aria-hidden="true" />
                                    </span>
                                  </div>
                                  <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                    <div>
                                      <p class="text-sm text-gray-500">
                                        {{ activity.content }}
                                      </p>
                                    </div>
                                    <div class="text-right text-sm whitespace-nowrap text-gray-500">
                                      <time :datetime="activity.datetime">{{ activity.time }}</time>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Rodapé -->
                <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div class="flex justify-end space-x-3">
                    <button
                      type="button"
                      class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      @click="close"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      @click="save"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, computed } from 'vue';
import { CheckIcon, UserIcon, ClockIcon, ExclamationIcon } from '@heroicons/vue/outline';

export interface Table {
  id: string;
  number: number | string;
  status: 'available' | 'occupied' | 'reserved' | 'needs_attention';
  capacity: number;
  location?: string;
  lastActivity?: string;
  currentOrder?: string;
  orderTime?: string;
  waiter?: string;
  notes?: string;
}

export interface Activity {
  id: number;
  type: string;
  content: string;
  time: string;
  datetime: string;
  icon: any;
  iconBackground: string;
}

export default defineComponent({
  name: 'TableDetailsModal',
  components: {
    CheckIcon,
    UserIcon,
    ClockIcon,
    ExclamationIcon
  },
  props: {
    table: {
      type: Object as PropType<Table>,
      required: true
    },
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close', 'update:table', 'start-order', 'view-order', 'request-bill', 'provide-assistance'],
  setup(props, { emit }) {
    // Refs
    const formData = ref<Table>({ ...props.table });
    const errors = ref<Record<string, string>>({});
    const activities = ref<Activity[]>([]);
    
    // Computed
    const isNewTable = computed(() => !props.table.id || props.table.id === 'new');
    
    // Watchers
    watch(() => props.table, (newTable) => {
      formData.value = { ...newTable };
      loadActivities();
    }, { immediate: true });
    
    // Methods
    const close = () => {
      emit('close');
    };
    
    const save = () => {
      // Validação
      const newErrors: Record<string, string> = {};
      
      if (!formData.value.number) {
        newErrors.number = 'O número da mesa é obrigatório';
      }
      
      if (!formData.value.status) {
        newErrors.status = 'O status é obrigatório';
      }
      
      if (!formData.value.capacity || formData.value.capacity < 1) {
        newErrors.capacity = 'A capacidade deve ser maior que zero';
      }
      
      errors.value = newErrors;
      
      if (Object.keys(newErrors).length === 0) {
        // Se for uma nova mesa, gera um ID
        const tableToSave = { 
          ...formData.value,
          id: isNewTable.value ? `table-${Date.now()}` : formData.value.id
        };
        
        emit('update:table', tableToSave);
        close();
      }
    };
    
    const startOrder = () => {
      emit('start-order', formData.value);
    };
    
    const viewOrder = () => {
      if (formData.value.currentOrder) {
        emit('view-order', formData.value);
      }
    };
    
    const requestBill = () => {
      emit('request-bill', formData.value);
    };
    
    const markAsNeedsAttention = () => {
      formData.value.status = 'needs_attention';
      // Em um caso real, aqui seria feita uma chamada à API
      save();
    };
    
    const resolveAttention = () => {
      formData.value.status = 'occupied';
      // Em um caso real, aqui seria feita uma chamada à API
      save();
    };
    
    const loadActivities = () => {
      // Dados de exemplo para o histórico de atividades
      activities.value = [
        {
          id: 1,
          type: 'order_created',
          content: 'Pedido #1234 criado',
          time: '5 min atrás',
          datetime: new Date(Date.now() - 5 * 60000).toISOString(),
          icon: CheckIcon,
          iconBackground: 'bg-green-500'
        },
        {
          id: 2,
          type: 'status_changed',
          content: 'Status alterado para Ocupada',
          time: '10 min atrás',
          datetime: new Date(Date.now() - 10 * 60000).toISOString(),
          icon: UserIcon,
          iconBackground: 'bg-blue-500'
        },
        {
          id: 3,
          type: 'created',
          content: 'Mesa criada',
          time: '1 hora atrás',
          datetime: new Date(Date.now() - 60 * 60000).toISOString(),
          icon: ClockIcon,
          iconBackground: 'bg-gray-400'
        }
      ];
      
      // Adiciona uma atividade de atenção se necessário
      if (formData.value.status === 'needs_attention') {
        activities.value.unshift({
          id: 0,
          type: 'attention_needed',
          content: 'Atenção solicitada',
          time: 'Agora mesmo',
          datetime: new Date().toISOString(),
          icon: ExclamationIcon,
          iconBackground: 'bg-yellow-500'
        });
      }
    };
    
    return {
      // Refs
      formData,
      errors,
      activities,
      
      // Computed
      isNewTable,
      
      // Methods
      close,
      save,
      startOrder,
      viewOrder,
      requestBill,
      markAsNeedsAttention,
      resolveAttention
    };
  }
});
</script>
