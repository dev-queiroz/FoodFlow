<template>
  <div class="cozinha-view">
    <CozinhaHeader />
    
    <main class="main-content">
      <!-- Painel de Controle -->
      <section class="control-panel">
        <div class="container">
          <h1>Painel da Cozinha</h1>
          <div class="stats-grid">
            <div class="stat-card">
              <h3>Pedidos Pendentes</h3>
              <p class="stat-value">12</p>
            </div>
            <div class="stat-card">
              <h3>Em Preparo</h3>
              <p class="stat-value">8</p>
            </div>
            <div class="stat-card">
              <h3>Prontos</h3>
              <p class="stat-value">4</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Fila de Pedidos -->
      <section class="orders-section">
        <div class="container">
          <h2 class="section-title">Pedidos</h2>
          
          <div class="order-filters">
            <button class="filter-btn active">Todos</button>
            <button class="filter-btn">Pendentes</button>
            <button class="filter-btn">Em Preparo</button>
            <button class="filter-btn">Prontos</button>
          </div>
          
          <div class="orders-grid">
            <div 
              v-for="order in orders" 
              :key="order.id"
              class="order-card"
              :class="order.status"
            >
              <div class="order-header">
                <h3>Pedido #{{ order.id }}</h3>
                <span class="order-time">{{ order.time }} min</span>
                <span class="order-status">{{ order.status }}</span>
              </div>
              
              <div class="order-items">
                <div 
                  v-for="item in order.items" 
                  :key="item.id"
                  class="order-item"
                >
                  <span class="quantity">{{ item.quantity }}x</span>
                  <span class="name">{{ item.name }}</span>
                  <span class="notes" v-if="item.notes">({{ item.notes }})</span>
                </div>
              </div>
              
              <div class="order-actions">
                <button 
                  class="btn btn-sm"
                  @click="updateOrderStatus(order.id, 'em_preparo')"
                  v-if="order.status === 'pendente'"
                >
                  Iniciar
                </button>
                <button 
                  class="btn btn-sm btn-primary"
                  @click="updateOrderStatus(order.id, 'pronto')"
                  v-if="order.status === 'em_preparo'"
                >
                  Finalizar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <MainFooter />
  </div>
</template>

<script>
export default {
  data() {
    return {
      orders: [
        {
          id: 1001,
          status: 'pendente',
          time: 15,
          items: [
            { id: 1, name: 'Filé Mignon', quantity: 2, notes: 'Ao ponto' },
            { id: 2, name: 'Risoto de Cogumelos', quantity: 1 },
            { id: 3, name: 'Coca-Cola', quantity: 2 }
          ]
        },
        {
          id: 1002,
          status: 'em_preparo',
          time: 8,
          items: [
            { id: 4, name: 'Salada Caesar', quantity: 1 },
            { id: 5, name: 'Suco de Laranja', quantity: 1 }
          ]
        }
      ]
    }
  },
  methods: {
    updateOrderStatus(orderId, newStatus) {
      const order = this.orders.find(o => o.id === orderId);
      if (order) order.status = newStatus;
    }
  }
}
</script>

<style scoped>
.cozinha-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.control-panel {
  background: var(--bg-primary);
  padding: 2rem 0;
  border-bottom: 1px solid var(--border-color);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.stat-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary);
  margin-top: 0.5rem;
}

.order-filters {
  display: flex;
  gap: 0.5rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  cursor: pointer;
}

.filter-btn.active {
  background: var(--primary);
  color: white;
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.order-card {
  background: var(--card-bg);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  border-left: 4px solid var(--border-color);
}

.order-card:hover {
  background: var(--card-hover);
}

.order-card.pendente {
  border-left-color: var(--warning);
}

.order-card.em_preparo {
  border-left-color: var(--primary);
}

.order-card.pronto {
  border-left-color: var(--success);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.order-status {
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.order-status.pendente {
  background: var(--warning-light);
  color: var(--warning-dark);
}

.order-status.em_preparo {
  background: var(--primary-light);
  color: var(--primary-dark);
}

.order-status.pronto {
  background: var(--success-light);
  color: var(--success-dark);
}

.order-items {
  margin: 1rem 0;
}

.order-item {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
}

.order-item .quantity {
  font-weight: bold;
  color: var(--primary);
}

.order-item .notes {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-style: italic;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}
</style>
