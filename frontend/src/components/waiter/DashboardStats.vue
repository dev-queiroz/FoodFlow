<template>
  <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
    <!-- Card de Faturamento do Dia -->
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="p-5">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Faturamento do Dia</dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">R$ {{ formatCurrency(stats.dailyRevenue) }}</div>
                <div 
                  :class="{
                    'text-green-600': stats.revenueChange >= 0,
                    'text-red-600': stats.revenueChange < 0
                  }"
                  class="ml-2 flex items-baseline text-sm font-semibold"
                >
                  <svg 
                    v-if="stats.revenueChange >= 0" 
                    class="self-center flex-shrink-0 h-5 w-5 text-green-500" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                  <svg 
                    v-else 
                    class="self-center flex-shrink-0 h-5 w-5 text-red-500" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="sr-only">
                    {{ stats.revenueChange >= 0 ? 'Aumentou' : 'Diminuiu' }} em
                  </span>
                  {{ Math.abs(stats.revenueChange) }}% em relação a ontem
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-5 py-3">
        <div class="text-sm">
          <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
            Ver relatório detalhado
          </a>
        </div>
      </div>
    </div>

    <!-- Card de Pedidos Hoje -->
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="p-5">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Pedidos Hoje</dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">{{ stats.ordersToday }}</div>
                <div 
                  :class="{
                    'text-green-600': stats.ordersChange >= 0,
                    'text-red-600': stats.ordersChange < 0
                  }"
                  class="ml-2 flex items-baseline text-sm font-semibold"
                >
                  <svg 
                    v-if="stats.ordersChange >= 0" 
                    class="self-center flex-shrink-0 h-5 w-5 text-green-500" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                  <svg 
                    v-else 
                    class="self-center flex-shrink-0 h-5 w-5 text-red-500" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="sr-only">
                    {{ stats.ordersChange >= 0 ? 'Aumentou' : 'Diminuiu' }} em
                  </span>
                  {{ Math.abs(stats.ordersChange) }}% em relação a ontem
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-5 py-3">
        <div class="text-sm">
          <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
            Ver todos os pedidos
          </a>
        </div>
      </div>
    </div>

    <!-- Card de Mesas Ocupadas -->
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="p-5">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-yellow-500 rounded-md p-3">
            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Mesas Ocupadas</dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">
                  {{ stats.occupiedTables }} <span class="text-lg text-gray-500">/ {{ stats.totalTables }}</span>
                </div>
                <div class="ml-2 flex items-baseline text-sm font-semibold text-blue-600">
                  {{ Math.round((stats.occupiedTables / stats.totalTables) * 100) }}% de ocupação
                </div>
              </dd>
            </dl>
            <div class="mt-2">
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  class="bg-blue-600 h-2.5 rounded-full" 
                  :style="{ width: `${Math.round((stats.occupiedTables / stats.totalTables) * 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-5 py-3">
        <div class="text-sm">
          <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
            Gerenciar mesas
          </a>
        </div>
      </div>
    </div>

    <!-- Card de Avaliação Média -->
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="p-5">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-purple-500 rounded-md p-3">
            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Avaliação Média</dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">
                  {{ stats.averageRating.toFixed(1) }}
                </div>
                <div class="ml-2 flex items-baseline text-sm font-semibold">
                  <span class="text-yellow-500">
                    ★★★★★
                  </span>
                  <span class="text-gray-500 ml-1">({{ stats.totalRatings }})</span>
                </div>
              </dd>
            </dl>
            <div class="mt-2">
              <div class="flex items-center">
                <div class="flex items-center">
                  <div class="flex">
                    <template v-for="i in 5" :key="i">
                      <svg 
                        :class="{
                          'text-yellow-400': i <= Math.round(stats.averageRating),
                          'text-gray-300': i > Math.round(stats.averageRating)
                        }" 
                        class="h-5 w-5" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </template>
                  </div>
                </div>
                <div class="ml-3 text-sm text-gray-500">
                  <span class="whitespace-nowrap">{{ getRatingText(stats.averageRating) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-5 py-3">
        <div class="text-sm">
          <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
            Ver avaliações
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export interface DashboardStatsData {
  dailyRevenue: number;
  revenueChange: number;
  ordersToday: number;
  ordersChange: number;
  occupiedTables: number;
  totalTables: number;
  averageRating: number;
  totalRatings: number;
}

export default defineComponent({
  name: 'DashboardStats',
  props: {
    stats: {
      type: Object as PropType<DashboardStatsData>,
      required: true
    }
  },
  setup() {
    // Formatar valor monetário
    const formatCurrency = (value: number): string => {
      return value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };

    // Obter texto descritivo para a avaliação
    const getRatingText = (rating: number): string => {
      if (rating >= 4.5) return 'Excelente';
      if (rating >= 4.0) return 'Muito bom';
      if (rating >= 3.0) return 'Bom';
      if (rating >= 2.0) return 'Regular';
      return 'Ruim';
    };

    return {
      formatCurrency,
      getRatingText
    };
  }
});
</script>
