<template>
  <div class="dashboard-layout">
    <SidebarMenu />
    <div class="dashboard-content">
      <h1>Dashboard</h1>
      <div class="dashboard-header">
        <div class="period-selector">
          <label for="period">Período:</label>
          <select id="period" v-model="selectedPeriod">
            <option v-for="period in periods" :key="period.value" :value="period.value">
              {{ period.label }}
            </option>
          </select>
        </div>
      </div>
      <div class="metrics-grid">
        <MetricCard title="Faturamento Total" :value="formatCurrency(metrics.faturamentoTotal)" subtitle="{{ periodLabel }}" />
        <MetricCard title="Lucro Líquido" :value="formatCurrency(metrics.lucroLiquido)" subtitle="{{ periodLabel }}" />
        <MetricCard title="Clientes Atendidos" :value="metrics.clientesAtendidos" subtitle="{{ periodLabel }}" />
        <MetricCard title="Pedidos Finalizados" :value="metrics.pedidosFinalizados" subtitle="{{ periodLabel }}" />
        <MetricCard title="Ticket Médio" :value="formatCurrency(metrics.ticketMedio)" subtitle="{{ periodLabel }}" />
        <MetricCard title="Produtos Vendidos" :value="metrics.produtosVendidos" subtitle="{{ periodLabel }}" />
      </div>
      <div class="dashboard-placeholder">
        <p>Mais gráficos e análises serão adicionados aqui futuramente.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import SidebarMenu from '@/components/dashboard/SidebarMenu.vue';
import MetricCard from '@/components/dashboard/MetricCard.vue';

export default defineComponent({
  name: 'DashboardView',
  components: {
    SidebarMenu,
    MetricCard
  },
  setup() {
    const periods = [
      { label: 'Hoje', value: 'day' },
      { label: 'Semana', value: 'week' },
      { label: 'Mês', value: 'month' },
      { label: 'Trimestre', value: 'quarter' },
      { label: 'Ano', value: 'year' }
    ];
    const selectedPeriod = ref('day');

    // All metrics start as zeroed placeholders
    const metrics = ref({
      faturamentoTotal: 0,
      lucroLiquido: 0,
      clientesAtendidos: 0,
      pedidosFinalizados: 0,
      ticketMedio: 0,
      produtosVendidos: 0
    });

    const periodLabel = computed(() => {
      const found = periods.find(p => p.value === selectedPeriod.value);
      return found ? found.label : '';
    });

    function formatCurrency(val: number) {
      return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    return {
      periods,
      selectedPeriod,
      metrics,
      periodLabel,
      formatCurrency
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
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}
.dashboard-content h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #222;
}
.dashboard-content p {
  color: #555;
}
.dashboard-header {
  width: 100%;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.period-selector {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1rem;
}
.period-selector select {
  border-radius: 0.5rem;
  border: 1px solid #bbb;
  padding: 0.3rem 0.8rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}
.period-selector select:focus {
  border-color: #1a7f37;
}
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 1.3rem;
  width: 100%;
  margin-bottom: 2.5rem;
}
.dashboard-placeholder {
  margin-top: 2.5rem;
  color: #888;
  font-size: 1.1rem;
  width: 100%;
  text-align: center;
}

@media (max-width: 900px) {
  .dashboard-layout {
    flex-direction: column;
  }
  .dashboard-content {
    padding: 1.2rem 0.7rem;
  }
}
</style>
