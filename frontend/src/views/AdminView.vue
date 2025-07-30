<template>
  <div class="dashboard-layout">
    <SidebarMenu />
    <div class="dashboard-content">
      <h1>Painel de Administração</h1>
      
      <div class="admin-sections">
        <!-- Seção de Controle de Acesso -->
        <div class="admin-section">
          <h2>Controle de Acesso</h2>
          <div class="access-control">
            <div class="user-list">
              <div 
                v-for="user in users" 
                :key="user.id"
                class="user-item"
              >
                <span class="user-name">{{ user.name }}</span>
                <span class="user-role">{{ user.role }}</span>
                <button class="edit-btn">Editar</button>
              </div>
            </div>
            <button class="add-user-btn">Adicionar Usuário</button>
          </div>
        </div>
        
        <!-- Seção de Configurações -->
        <div class="admin-section">
          <h2>Configurações do Sistema</h2>
          <div class="settings-grid">
            <div class="setting-card">
              <h3>Horário de Funcionamento</h3>
              <div class="setting-placeholder"></div>
              <button class="edit-btn">Configurar</button>
            </div>
            
            <div class="setting-card">
              <h3>Taxas e Impostos</h3>
              <div class="setting-placeholder"></div>
              <button class="edit-btn">Configurar</button>
            </div>
            
            <div class="setting-card">
              <h3>Integrações</h3>
              <div class="setting-placeholder"></div>
              <button class="edit-btn">Configurar</button>
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
  name: 'AdminView',
  components: {
    SidebarMenu
  },
  data() {
    return {
      users: [
        { id: 1, name: 'Admin Master', role: 'Administrador' },
        { id: 2, name: 'Gerente Restaurante', role: 'Gerente' },
        { id: 3, name: 'Caixa 01', role: 'Caixa' }
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

.admin-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.admin-section {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.25rem;
}

.user-name {
  flex: 1;
  font-weight: 500;
}

.user-role {
  width: 120px;
  color: #64748b;
}

.edit-btn, .add-user-btn {
  padding: 0.5rem 1rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-left: 1rem;
}

.add-user-btn {
  margin-left: 0;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.setting-card {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.setting-placeholder {
  height: 80px;
  background: #e2e8f0;
  border-radius: 0.25rem;
  margin: 0.5rem 0;
}
</style>
