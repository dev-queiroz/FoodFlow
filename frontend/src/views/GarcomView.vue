<template>
  <div class="garcom-view">
    <GarcomHeader />
    
    <main class="main-content">
      <!-- Painel de Mesas -->
      <section class="tables-section">
        <div class="container">
          <h1>Painel do Garçom</h1>
          
          <div class="tabs">
            <button class="tab active">Mesas</button>
            <button class="tab">Pedidos</button>
            <button class="tab">Pagamentos</button>
          </div>
          
          <div class="tables-grid">
            <div 
              v-for="table in tables" 
              :key="table.id"
              class="table-card"
              :class="{ 'occupied': table.status === 'ocupada', 'available': table.status === 'disponivel' }"
              @click="selectTable(table.id)"
            >
              <div class="table-number">Mesa {{ table.number }}</div>
              <div class="table-status">{{ table.status }}</div>
              <div class="table-info" v-if="table.status === 'ocupada'">
                <span>{{ table.orders }} pedidos</span>
                <span>R$ {{ table.total }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Modal de Pedido -->
      <div class="order-modal" v-if="selectedTable">
        <div class="modal-content">
          <h2>Novo Pedido - Mesa {{ selectedTable.number }}</h2>
          
          <div class="menu-items">
            <div 
              v-for="item in menuItems" 
              :key="item.id"
              class="menu-item"
              @click="addToOrder(item)"
            >
              <span class="item-name">{{ item.name }}</span>
              <span class="item-price">R$ {{ item.price }}</span>
            </div>
          </div>
          
          <div class="current-order">
            <h3>Pedido Atual</h3>
            <div 
              v-for="(item, index) in currentOrder" 
              :key="index"
              class="order-item"
            >
              <span class="quantity">{{ item.quantity }}x</span>
              <span class="name">{{ item.name }}</span>
              <span class="price">R$ {{ (item.price * item.quantity).toFixed(2) }}</span>
              <button 
                class="remove-btn"
                @click="removeFromOrder(index)"
              >
                ×
              </button>
            </div>
            
            <div class="order-total">
              <span>Total:</span>
              <span>R$ {{ orderTotal.toFixed(2) }}</span>
            </div>
            
            <div class="modal-actions">
              <button 
                class="btn btn-outline"
                @click="cancelOrder"
              >
                Cancelar
              </button>
              <button 
                class="btn btn-primary"
                @click="submitOrder"
              >
                Enviar para Cozinha
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <MainFooter />
  </div>
</template>

<script>
export default {
  data() {
    return {
      tables: [
        { id: 1, number: 1, status: 'disponivel' },
        { id: 2, number: 2, status: 'ocupada', orders: 3, total: 127.50 },
        { id: 3, number: 3, status: 'disponivel' },
        { id: 4, number: 4, status: 'ocupada', orders: 1, total: 45.00 },
        { id: 5, number: 5, status: 'disponivel' },
        { id: 6, number: 6, status: 'reservada' }
      ],
      menuItems: [
        { id: 1, name: 'Filé Mignon', price: 89.90 },
        { id: 2, name: 'Risoto de Cogumelos', price: 59.90 },
        { id: 3, name: 'Salada Caesar', price: 39.90 },
        { id: 4, name: 'Água Mineral', price: 8.00 },
        { id: 5, name: 'Refrigerante', price: 10.00 },
        { id: 6, name: 'Sobremesa do Chef', price: 25.00 }
      ],
      selectedTable: null,
      currentOrder: []
    }
  },
  computed: {
    orderTotal() {
      return this.currentOrder.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    }
  },
  methods: {
    selectTable(tableId) {
      this.selectedTable = this.tables.find(t => t.id === tableId)
      this.currentOrder = []
    },
    addToOrder(item) {
      const existingItem = this.currentOrder.find(i => i.id === item.id)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        this.currentOrder.push({ ...item, quantity: 1 })
      }
    },
    removeFromOrder(index) {
      this.currentOrder.splice(index, 1)
    },
    cancelOrder() {
      this.selectedTable = null
      this.currentOrder = []
    },
    submitOrder() {
      // Lógica para enviar pedido para cozinha
      alert(`Pedido para Mesa ${this.selectedTable.number} enviado!`)
      this.cancelOrder()
    }
  }
}
</script>

<style scoped>
.garcom-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.tables-section {
  padding: 2rem 0;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin: 1.5rem 0;
}

.tab {
  padding: 0.75rem 1.5rem;
  background: var(--bg-secondary);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.tab.active {
  background: var(--primary);
  color: white;
}

.tables-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.table-card {
  background: var(--card-bg);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  cursor: pointer;
  transition: var(--transition);
  border: 2px solid transparent;
}

.table-card:hover {
  background: var(--card-hover);
}

.table-card.available {
  border-color: var(--success);
}

.table-card.occupied {
  border-color: var(--warning);
}

.table-number {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.table-status {
  text-transform: capitalize;
  color: var(--text-secondary);
}

.table-info {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}

.order-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: var(--radius-lg);
  padding: 2rem;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.menu-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-content: start;
}

.menu-item {
  background: var(--card-bg);
  padding: 1rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition);
}

.menu-item:hover {
  background: var(--card-hover);
}

.current-order {
  background: var(--bg-primary);
  padding: 1.5rem;
  border-radius: var(--radius-md);
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.order-total {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.25rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.remove-btn {
  background: none;
  border: none;
  color: var(--danger);
  cursor: pointer;
  font-size: 1.25rem;
}
</style>
