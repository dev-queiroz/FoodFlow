<template>
  <div class="dashboard-layout">
    <SidebarMenu />
    <div class="dashboard-content">
      <h1>Relatórios</h1>
      
      <div class="reports-sections">
        <!-- Seção de Filtros -->
        <div class="filters-section">
          <h2>Filtrar Relatórios</h2>
          <div class="filter-options">
            <div class="filter-group">
              <label>Período:</label>
              <select>
                <option>Últimos 7 dias</option>
                <option>Últimos 30 dias</option>
                <option>Este mês</option>
                <option>Personalizado</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label>Tipo de Relatório:</label>
              <select>
                <option>Vendas</option>
                <option>Produtos</option>
                <option>Clientes</option>
                <option>Desempenho</option>
              </select>
            </div>
            
            <button class="generate-btn">Gerar Relatório</button>
          </div>
        </div>
        
        <!-- Seção de Visualização -->
        <div class="report-preview-section">
          <h2>Pré-visualização</h2>
          <div class="report-placeholder">
            <p>Selecione os filtros e gere o relatório para visualizar os dados</p>
          </div>
          <div class="report-actions">
            <button class="export-btn">Exportar PDF</button>
            <button class="export-btn">Exportar Excel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SidebarMenu from '@/components/dashboard/SidebarMenu.vue';

export default defineComponent({
  name: 'RelatoriosView',
  components: {
    SidebarMenu
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
}

.reports-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.filters-section, .report-preview-section {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.filter-options {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
}

.generate-btn, .export-btn {
  padding: 0.5rem 1rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  height: fit-content;
}

.report-placeholder {
  height: 300px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  margin: 1rem 0;
}

.report-actions {
  display: flex;
  gap: 1rem;
}

.export-btn {
  background: #10b981;
}
</style>
