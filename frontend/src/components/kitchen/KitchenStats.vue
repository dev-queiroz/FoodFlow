<template>
  <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
    <!-- Pedidos Pendentes -->
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="p-5">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-yellow-500 rounded-md p-3">
            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Pedidos Pendentes</dt>
              <dd>
                <div class="text-lg font-medium text-gray-900">{{ stats.pendingOrders }}</div>
                <div class="flex items-center text-sm text-gray-500">
                  <span :class="stats.pendingChange >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ stats.pendingChange > 0 ? '+' : '' }}{{ stats.pendingChange }}%
                  </span>
                  <span class="ml-1">em relação à última hora</span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-5 py-3">
        <div class="text-sm">
          <a href="#" class="font-medium text-primary-600 hover:text-primary-500">Ver todos</a>
        </div>
      </div>
    </div>
    
    <!-- Em Preparo -->
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="p-5">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Em Preparo</dt>
              <dd>
                <div class="text-lg font-medium text-gray-900">{{ stats.preparingOrders }}</div>
                <div class="flex items-center text-sm text-gray-500">
                  <span :class="stats.preparingChange >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ stats.preparingChange > 0 ? '+' : '' }}{{ stats.preparingChange }}%
                  </span>
                  <span class="ml-1">em relação à última hora</span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-5 py-3">
        <div class="text-sm">
          <a href="#" class="font-medium text-primary-600 hover:text-primary-500">Ver todos</a>
        </div>
      </div>
    </div>
    
    <!-- Prontos para Entrega -->
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="p-5">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Prontos para Entrega</dt>
              <dd>
                <div class="text-lg font-medium text-gray-900">{{ stats.readyOrders }}</div>
                <div class="flex items-center text-sm text-gray-500">
                  <span :class="stats.readyChange >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ stats.readyChange > 0 ? '+' : '' }}{{ stats.readyChange }}%
                  </span>
                  <span class="ml-1">em relação à última hora</span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-5 py-3">
        <div class="text-sm">
          <a href="#" class="font-medium text-primary-600 hover:text-primary-500">Ver todos</a>
        </div>
      </div>
    </div>
    
    <!-- Tempo Médio de Preparo -->
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="p-5">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-purple-500 rounded-md p-3">
            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Tempo Médio</dt>
              <dd>
                <div class="text-lg font-medium text-gray-900">{{ stats.averageTime }} min</div>
                <div class="flex items-center text-sm text-gray-500">
                  <span :class="stats.averageTimeChange <= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ stats.averageTimeChange > 0 ? '+' : '' }}{{ stats.averageTimeChange }}%
                  </span>
                  <span class="ml-1">em relação à última hora</span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-5 py-3">
        <div class="text-sm">
          <span class="font-medium text-gray-500">Atualizado: agora</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export interface KitchenStatsData {
  pendingOrders: number;
  pendingChange: number;
  preparingOrders: number;
  preparingChange: number;
  readyOrders: number;
  readyChange: number;
  averageTime: number;
  averageTimeChange: number;
}

export default defineComponent({
  name: 'KitchenStats',
  props: {
    stats: {
      type: Object as PropType<KitchenStatsData>,
      required: true
    }
  }
});
</script>
