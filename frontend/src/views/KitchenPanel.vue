<template>
  <div class="kitchen-panel">
    <!-- Header animado -->
    <header class="fade-in">
      <h1 class="bounce">Painel da Cozinha</h1>
      <p class="slide-up">Pedidos em preparo</p>
    </header>

    <!-- Fila de pedidos -->
    <section class="orders-queue">
      <div 
        v-for="order in kitchenOrders" 
        :key="order.id"
        class="order-card slide-up"
        :style="{ 'animation-delay': `${0.1 * order.id}s` }"
      >
        <div class="order-header">
          <span class="order-id">#{{ order.id }}</span>
          <span class="table-number">Mesa {{ order.table }}</span>
          <span class="order-time">{{ order.time }} min</span>
        </div>
        
        <div class="order-items">
          <div 
            v-for="item in order.items" 
            :key="item.id"
            class="order-item fade-in"
          >
            {{ item.quantity }}x {{ item.name }}
            <span v-if="item.notes" class="item-notes">({{ item.notes }})</span>
          </div>
        </div>
        
        <div class="order-actions">
          <button class="action-button">Iniciar</button>
          <button class="action-button">Concluir</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Dados temporários para o wireframe
const kitchenOrders = [
  {
    id: 1,
    table: 2,
    time: 15,
    items: [
      { id: 1, name: 'Pizza Margherita', quantity: 1, notes: 'Sem cebola' },
      { id: 2, name: 'Refrigerante', quantity: 2 }
    ]
  },
  {
    id: 2,
    table: 4,
    time: 5,
    items: [
      { id: 3, name: 'Salada Caesar', quantity: 1 }
    ]
  }
]
</script>

<style scoped>
/* Reutilizando animações básicas */
.fade-in, .slide-up, .bounce {
  animation-duration: 0.5s;
  animation-fill-mode: both;
}

/* Estilos específicos do painel da cozinha */
.kitchen-panel {
  padding: 1rem;
}

.orders-queue {
  margin-top: 1rem;
  display: grid;
  gap: 1rem;
}

.order-card {
  padding: 1rem;
  border-radius: 8px;
  background: #fff3e0;
  border-left: 4px solid #ff9800;
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.order-items {
  margin: 0.5rem 0;
}

.order-item {
  padding: 0.25rem 0;
  border-bottom: 1px dashed #ffe0b2;
}

.item-notes {
  color: #e65100;
  font-size: 0.8em;
}

.order-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.action-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #ff9800;
  color: white;
  cursor: pointer;
}

.action-button:hover {
  background: #fb8c00;
}
</style>
