<template>
  <div class="dashboard-layout">
    <SidebarMenu />
    <div class="dashboard-content">
      <h1>Controle de Estoque</h1>
      
      <div class="inventory-sections">
        <!-- Seção de Produtos -->
        <div class="inventory-section">
          <div class="section-header">
            <h2>Produtos</h2>
            <button class="add-btn">Adicionar Produto</button>
          </div>
          
          <div class="inventory-table">
            <div class="table-header">
              <span>Produto</span>
              <span>Quantidade</span>
              <span>Última Atualização</span>
              <span>Ações</span>
            </div>
            
            <div class="table-row" v-for="item in inventory" :key="item.id">
              <span>{{ item.name }}</span>
              <span :class="{ 'low-stock': item.quantity < item.minQuantity }">
                {{ item.quantity }} {{ item.unit }}
              </span>
              <span>{{ item.lastUpdate }}</span>
              <div class="actions">
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Excluir</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Seção de Alertas -->
        <div class="inventory-section">
          <h2>Alertas de Estoque</h2>
          <div class="alerts-list">
            <div class="alert-item" v-for="alert in alerts" :key="alert.id">
              <span class="alert-icon">⚠️</span>
              <span class="alert-message">{{ alert.message }}</span>
            </div>
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
  name: 'EstoqueView',
  components: {
    SidebarMenu
  },
  data() {
    return {
      inventory: [
        { id: 1, name: 'Arroz', quantity: 5, unit: 'kg', minQuantity: 10, lastUpdate: '30/07/2025' },
        { id: 2, name: 'Feijão', quantity: 8, unit: 'kg', minQuantity: 5, lastUpdate: '29/07/2025' },
        { id: 3, name: 'Óleo', quantity: 12, unit: 'L', minQuantity: 8, lastUpdate: '28/07/2025' },
        { id: 4, name: 'Sal', quantity: 3, unit: 'kg', minQuantity: 5, lastUpdate: '27/07/2025' }
      ],
      alerts: [
        { id: 1, message: 'Estoque de Arroz abaixo do mínimo (5kg/10kg)' },
        { id: 2, message: 'Estoque de Sal abaixo do mínimo (3kg/5kg)' }
      ]
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
}

.inventory-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.inventory-section {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.add-btn {
  padding: 0.5rem 1rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.inventory-table {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
}

.table-header, .table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.table-header {
  font-weight: 600;
}

.low-stock {
  color: #ef4444;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .delete-btn {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.edit-btn {
  background: #f59e0b;
  color: white;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.alerts-list {
  margin-top: 1rem;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #fef2f2;
  border-left: 4px solid #ef4444;
  margin-bottom: 0.5rem;
  border-radius: 0.25rem;
}

.alert-icon {
  font-size: 1.25rem;
}

.alert-message {
  color: #ef4444;
}
</style>
