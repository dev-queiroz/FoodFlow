<template>
  <div class="admin-view">
    <AdminHeader />
    
    <main class="main-content">
      <!-- Painel de Controle -->
      <section class="dashboard-section">
        <div class="container">
          <h1>Painel do Administrador</h1>
          
          <div class="stats-grid">
            <div class="stat-card">
              <h3>Vendas Hoje</h3>
              <p class="stat-value">R$ 2.845,50</p>
              <p class="stat-change positive">+12%</p>
            </div>
            <div class="stat-card">
              <h3>Pedidos Ativos</h3>
              <p class="stat-value">15</p>
              <p class="stat-change neutral">±0</p>
            </div>
            <div class="stat-card">
              <h3>Mesas Ocupadas</h3>
              <p class="stat-value">8/12</p>
              <p class="stat-change negative">-2</p>
            </div>
            <div class="stat-card">
              <h3>Avaliação Média</h3>
              <p class="stat-value">4.7 ★</p>
              <p class="stat-change positive">+0.2</p>
            </div>
          </div>
          
          <div class="tabs">
            <button class="tab active">Resumo</button>
            <button class="tab">Cardápio</button>
            <button class="tab">Funcionários</button>
            <button class="tab">Relatórios</button>
          </div>
          
          <!-- Conteúdo da Aba Resumo -->
          <div class="tab-content active">
            <div class="grid-layout">
              <div class="chart-container">
                <h3>Vendas dos Últimos 7 Dias</h3>
                <div class="chart-placeholder">
                  [Gráfico de Vendas]
                </div>
              </div>
              
              <div class="chart-container">
                <h3>Itens Mais Vendidos</h3>
                <div class="chart-placeholder">
                  [Gráfico de Itens]
                </div>
              </div>
              
              <div class="recent-orders">
                <h3>Pedidos Recentes</h3>
                <div class="orders-list">
                  <div 
                    v-for="order in recentOrders" 
                    :key="order.id"
                    class="order-item"
                  >
                    <span class="order-id">#{{ order.id }}</span>
                    <span class="order-table">Mesa {{ order.table }}</span>
                    <span class="order-amount">R$ {{ order.amount }}</span>
                    <span class="order-status" :class="order.status">{{ order.status }}</span>
                  </div>
                </div>
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
      darkMode: false,
      recentOrders: [
        { id: 1042, table: 5, amount: '127,50', status: 'finalizado' },
        { id: 1041, table: 3, amount: '89,90', status: 'preparando' },
        { id: 1040, table: 8, amount: '215,80', status: 'entregue' },
        { id: 1039, table: 2, amount: '64,00', status: 'finalizado' },
        { id: 1038, table: 7, amount: '153,20', status: 'entregue' }
      ]
    }
  },
  methods: {
    toggleTheme() {
      this.darkMode = !this.darkMode;
      document.documentElement.classList.toggle('dark', this.darkMode);
    }
  }
}
</script>

<style scoped>
.admin-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.dashboard-section {
  padding: 2rem 0;
  flex: 1;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.stat-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: var(--card-hover);
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary);
  margin: 0.5rem 0;
}

.stat-change {
  font-size: 0.9rem;
  font-weight: bold;
}

.stat-change.positive {
  color: var(--success);
}

.stat-change.negative {
  color: var(--danger);
}

.stat-change.neutral {
  color: var(--text-secondary);
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin: 1.5rem 0;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.tab {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  cursor: pointer;
  position: relative;
  bottom: -1px;
}

.tab.active {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-bottom: 1px solid var(--bg-primary);
}

.grid-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1rem;
}

.chart-container {
  background: var(--card-bg);
  border-radius: var(--radius-md);
  padding: 1.5rem;
}

.chart-placeholder {
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.05);
  border-radius: var(--radius-sm);
  margin-top: 1rem;
  color: var(--text-secondary);
}

.recent-orders {
  grid-column: span 2;
  background: var(--card-bg);
  border-radius: var(--radius-md);
  padding: 1.5rem;
}

.orders-list {
  margin-top: 1rem;
}

.order-item {
  display: grid;
  grid-template-columns: 80px 100px 1fr 100px;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom-color: var(--border-color);
}

.order-item:last-child {
  border-bottom: none;
}

.order-status {
  text-transform: capitalize;
  font-weight: bold;
  text-align: right;
}

.order-status.finalizado {
  color: var(--success);
}

.order-status.preparando {
  color: var(--warning);
}

.order-status.entregue {
  color: var(--primary);
}
</style>
