<template>
  <div class="waiter-panel">
    <!-- Header animado -->
    <header class="fade-in">
      <h1 class="bounce">Painel do Garçom</h1>
    </header>

    <!-- Seção de mesas -->
    <section class="tables-section slide-up">
      <h2>Mesas</h2>
      <div class="tables-grid">
        <div 
          v-for="table in tables" 
          :key="table.id"
          class="table-item fade-in"
          :class="{ 'occupied': table.status === 'occupied' }"
        >
          <span>Mesa {{ table.number }}</span>
          <span>{{ table.status === 'occupied' ? 'Ocupada' : 'Livre' }}</span>
        </div>
      </div>
    </section>

    <!-- Seção de pedidos -->
    <section class="orders-section slide-up">
      <h2>Pedidos Recentes</h2>
      <div class="orders-list">
        <div 
          v-for="order in recentOrders" 
          :key="order.id"
          class="order-item fade-in"
        >
          <div>Mesa {{ order.table }}</div>
          <div>{{ order.items.length }} itens</div>
          <div class="status" :class="order.status">
            {{ order.status === 'pending' ? 'Pendente' : 'Entregue' }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Dados temporários para o wireframe
const tables = [
  { id: 1, number: 1, status: 'free' },
  { id: 2, number: 2, status: 'occupied' },
  { id: 3, number: 3, status: 'free' },
  { id: 4, number: 4, status: 'occupied' },
]

const recentOrders = [
  { id: 1, table: 2, items: [1, 2], status: 'pending' },
  { id: 2, table: 4, items: [3], status: 'pending' },
]
</script>

<style scoped>
/* Reutilizando animações do HomeView */
.fade-in, .slide-up, .bounce {
  animation-duration: 0.5s;
  animation-fill-mode: both;
}

.fade-in {
  animation-name: fadeIn;
}

.slide-up {
  animation-name: slideUp;
}

.bounce {
  animation-name: bounce;
}

/* Estilos específicos do painel */
.waiter-panel {
  padding: 1rem;
}

.tables-grid, .orders-list {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.tables-grid {
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
}

.table-item, .order-item {
  padding: 1rem;
  border-radius: 8px;
  background: #f5f5f5;
  text-align: center;
}

.table-item.occupied {
  background: #ffebee;
  border-left: 4px solid #f44336;
}

.order-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
}

.status.pending {
  color: #ff9800;
}

.status.delivered {
  color: #4caf50;
}
</style>
