<template>
  <div class="admin-panel">
    <!-- Header animado -->
    <header class="fade-in">
      <h1 class="bounce">Painel Administrativo</h1>
    </header>

    <!-- Dashboard -->
    <section class="dashboard slide-up">
      <h2>Visão Geral</h2>
      <div class="stats-grid">
        <div class="stat-card fade-in" v-for="stat in stats" :key="stat.id">
          <h3>{{ stat.value }}</h3>
          <p>{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- Seção de gerenciamento -->
    <section class="management-section">
      <div class="tabs slide-up">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="tab-button fade-in"
          :class="{ 'active': activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Conteúdo dos tabs -->
      <div class="tab-content">
        <div v-if="activeTab === 'menu'" class="fade-in">
          <h3>Gerenciar Cardápio</h3>
          <div class="form-group">
            <input type="text" placeholder="Nome do item" class="form-input">
            <input type="text" placeholder="Preço" class="form-input">
            <button class="form-button">Adicionar</button>
          </div>
          <div class="menu-items">
            <div 
              v-for="item in menuItems" 
              :key="item.id"
              class="menu-item slide-up"
            >
              <span>{{ item.name }}</span>
              <span>R$ {{ item.price }}</span>
              <button class="action-button">Editar</button>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'users'" class="fade-in">
          <h3>Gerenciar Usuários</h3>
          <div class="users-list">
            <div 
              v-for="user in users" 
              :key="user.id"
              class="user-item slide-up"
            >
              <span>{{ user.name }}</span>
              <span class="role">{{ user.role }}</span>
              <button class="action-button">Editar</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Dados temporários para o wireframe
const stats = [
  { id: 1, label: 'Pedidos Hoje', value: 24 },
  { id: 2, label: 'Faturamento', value: 'R$ 1.250,00' },
  { id: 3, label: 'Mesas Ocupadas', value: '5/10' },
  { id: 4, label: 'Avaliação Média', value: '4.8' }
]

const tabs = [
  { id: 'menu', label: 'Cardápio' },
  { id: 'users', label: 'Usuários' },
  { id: 'reports', label: 'Relatórios' }
]

const activeTab = ref('menu')

const menuItems = [
  { id: 1, name: 'Pizza Margherita', price: '45,90' },
  { id: 2, name: 'Salada Caesar', price: '32,50' },
  { id: 3, name: 'Refrigerante', price: '8,90' }
]

const users = [
  { id: 1, name: 'João Silva', role: 'Gerente' },
  { id: 2, name: 'Maria Souza', role: 'Garçom' },
  { id: 3, name: 'Carlos Oliveira', role: 'Cozinheiro' }
]
</script>

<style scoped>
/* Reutilizando animações */
.fade-in, .slide-up, .bounce {
  animation-duration: 0.5s;
  animation-fill-mode: both;
}

/* Estilos específicos do painel admin */
.admin-panel {
  padding: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.stat-card {
  padding: 1rem;
  border-radius: 8px;
  background: #f5f5f5;
  text-align: center;
}

.stat-card h3 {
  font-size: 1.5rem;
  margin: 0;
  color: #2196f3;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

.tab-button {
  padding: 0.5rem 1rem;
  border: none;
  background: #e0e0e0;
  cursor: pointer;
}

.tab-button.active {
  background: #2196f3;
  color: white;
}

.form-group {
  display: grid;
  gap: 0.5rem;
  margin: 1rem 0;
}

.form-input {
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.form-button, .action-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #4caf50;
  color: white;
  cursor: pointer;
}

.menu-items, .users-list {
  display: grid;
  gap: 0.5rem;
}

.menu-item, .user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}

.role {
  color: #2196f3;
  font-weight: bold;
}
</style>
