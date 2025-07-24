<template>
  <div class="dashboard-layout">
    <SidebarMenu />
    <div class="dashboard-content">
      <!-- Header da página -->
      <div class="page-header">
        <h1>Gestão de Mesas</h1>
        <div class="header-actions">
          <button class="btn btn-outline" @click="showLayoutView = !showLayoutView">
            <i class="fas" :class="showLayoutView ? 'fa-list' : 'fa-th-large'"></i>
            {{ showLayoutView ? 'Lista' : 'Layout' }}
          </button>
          <button class="btn btn-primary" @click="showAddTable = true">
            <i class="fas fa-plus"></i>
            Adicionar Mesa
          </button>
        </div>
      </div>

      <!-- Estatísticas rápidas -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon available">
            <i class="fas fa-chair"></i>
          </div>
          <div class="stat-info">
            <h3>{{ getTablesByStatus('available').length }}</h3>
            <p>Mesas Disponíveis</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon occupied">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-info">
            <h3>{{ getTablesByStatus('occupied').length }}</h3>
            <p>Mesas Ocupadas</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon reserved">
            <i class="fas fa-bookmark"></i>
          </div>
          <div class="stat-info">
            <h3>{{ getTablesByStatus('reserved').length }}</h3>
            <p>Mesas Reservadas</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon cleaning">
            <i class="fas fa-broom"></i>
          </div>
          <div class="stat-info">
            <h3>{{ getTablesByStatus('needs_cleaning').length }}</h3>
            <p>Precisam Limpeza</p>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Buscar mesas..." 
            v-model="searchTerm"
          >
        </div>
        <select v-model="selectedStatus" class="status-filter">
          <option value="">Todos os status</option>
          <option value="available">Disponível</option>
          <option value="occupied">Ocupada</option>
          <option value="reserved">Reservada</option>
          <option value="needs_cleaning">Precisa Limpeza</option>
        </select>
        <select v-model="selectedLocation" class="location-filter">
          <option value="">Todas as localizações</option>
          <option value="indoor">Área Interna</option>
          <option value="outdoor">Área Externa</option>
          <option value="terrace">Terraço</option>
          <option value="private">Sala Privada</option>
        </select>
      </div>

      <!-- Visualização Layout -->
      <div v-if="showLayoutView" class="layout-view">
        <div class="layout-container">
          <h3>Layout do Restaurante</h3>
          <div class="restaurant-layout">
            <div 
              v-for="table in filteredTables" 
              :key="table.id"
              class="table-layout-item"
              :class="[`status-${table.status}`, `location-${table.location}`]"
              @click="selectTable(table)"
            >
              <div class="table-visual">
                <span class="table-number">{{ table.number }}</span>
                <span class="table-capacity">{{ table.capacity }}p</span>
              </div>
              <div class="table-status-indicator" :class="table.status"></div>
            </div>
          </div>
          <div class="layout-legend">
            <div class="legend-item">
              <div class="legend-color available"></div>
              <span>Disponível</span>
            </div>
            <div class="legend-item">
              <div class="legend-color occupied"></div>
              <span>Ocupada</span>
            </div>
            <div class="legend-item">
              <div class="legend-color reserved"></div>
              <span>Reservada</span>
            </div>
            <div class="legend-item">
              <div class="legend-color needs_cleaning"></div>
              <span>Limpeza</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Visualização Lista -->
      <div v-else class="tables-grid">
        <div 
          v-for="table in filteredTables" 
          :key="table.id" 
          class="table-card"
          :class="`status-${table.status}`"
        >
          <div class="table-header">
            <div class="table-main-info">
              <h3>Mesa {{ table.number }}</h3>
              <div class="table-details">
                <span class="capacity">
                  <i class="fas fa-users"></i>
                  {{ table.capacity }} pessoas
                </span>
                <span class="location">
                  <i class="fas fa-map-marker-alt"></i>
                  {{ getLocationText(table.location) }}
                </span>
              </div>
            </div>
            <div class="table-status" :class="table.status">
              {{ getStatusText(table.status) }}
            </div>
          </div>

          <div class="table-info">
            <div class="info-row" v-if="table.currentOrderId">
              <span class="label">Pedido Atual:</span>
              <span class="value">#{{ table.currentOrderId }}</span>
            </div>
            <div class="info-row" v-if="table.lastUsed">
              <span class="label">Último Uso:</span>
              <span class="value">{{ formatDate(table.lastUsed) }}</span>
            </div>
            <div class="info-row" v-if="table.notes">
              <span class="label">Observações:</span>
              <span class="value">{{ table.notes }}</span>
            </div>
          </div>

          <div class="table-actions">
            <button class="btn-icon" @click="editTable(table)" title="Editar Mesa">
              <i class="fas fa-edit"></i>
            </button>
            <button 
              class="btn-icon" 
              @click="generateQRCode(table)" 
              title="Gerar QR Code"
            >
              <i class="fas fa-qrcode"></i>
            </button>
            <button 
              class="btn-icon" 
              @click="changeTableStatus(table)" 
              title="Alterar Status"
            >
              <i class="fas fa-sync-alt"></i>
            </button>
            <button 
              class="btn-icon danger" 
              @click="deleteTable(table)" 
              title="Excluir Mesa"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>

        <!-- Card para adicionar nova mesa -->
        <div class="table-card add-table" @click="showAddTable = true">
          <div class="add-icon">
            <i class="fas fa-plus"></i>
          </div>
          <p>Adicionar Mesa</p>
        </div>
      </div>

      <!-- Modal para adicionar/editar mesa -->
      <div v-if="showAddTable" class="modal-overlay" @click="showAddTable = false">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>{{ editingTable ? 'Editar Mesa' : 'Adicionar Mesa' }}</h3>
            <button class="modal-close" @click="showAddTable = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveTable">
              <div class="form-row">
                <div class="form-group">
                  <label>Número da Mesa:</label>
                  <input type="number" v-model="tableForm.number" required min="1">
                </div>
                <div class="form-group">
                  <label>Capacidade:</label>
                  <input type="number" v-model="tableForm.capacity" required min="1" max="20">
                </div>
              </div>
              <div class="form-group">
                <label>Localização:</label>
                <select v-model="tableForm.location" required>
                  <option value="">Selecione uma localização</option>
                  <option value="indoor">Área Interna</option>
                  <option value="outdoor">Área Externa</option>
                  <option value="terrace">Terraço</option>
                  <option value="private">Sala Privada</option>
                </select>
              </div>
              <div class="form-group">
                <label>Status:</label>
                <select v-model="tableForm.status" required>
                  <option value="available">Disponível</option>
                  <option value="occupied">Ocupada</option>
                  <option value="reserved">Reservada</option>
                  <option value="needs_cleaning">Precisa Limpeza</option>
                </select>
              </div>
              <div class="form-group">
                <label>Observações:</label>
                <textarea v-model="tableForm.notes" rows="3" placeholder="Observações sobre a mesa..."></textarea>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-outline" @click="showAddTable = false">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-primary">
                  {{ editingTable ? 'Salvar' : 'Adicionar' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal de QR Code -->
      <div v-if="showQRCode" class="modal-overlay" @click="showQRCode = false">
        <div class="modal qr-modal" @click.stop>
          <div class="modal-header">
            <h3>QR Code - Mesa {{ selectedTable?.number }}</h3>
            <button class="modal-close" @click="showQRCode = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="qr-code-container">
              <div class="qr-code-placeholder">
                <i class="fas fa-qrcode"></i>
                <p>QR Code da Mesa {{ selectedTable?.number }}</p>
                <small>Os clientes podem escanear este código para acessar o cardápio</small>
              </div>
              <div class="qr-actions">
                <button class="btn btn-outline">
                  <i class="fas fa-download"></i>
                  Baixar PNG
                </button>
                <button class="btn btn-outline">
                  <i class="fas fa-print"></i>
                  Imprimir
                </button>
                <button class="btn btn-primary">
                  <i class="fas fa-share-alt"></i>
                  Compartilhar Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de alteração de status -->
      <div v-if="showStatusChange" class="modal-overlay" @click="showStatusChange = false">
        <div class="modal status-modal" @click.stop>
          <div class="modal-header">
            <h3>Alterar Status - Mesa {{ selectedTable?.number }}</h3>
            <button class="modal-close" @click="showStatusChange = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="status-options">
              <button 
                v-for="status in statusOptions" 
                :key="status.value"
                class="status-option"
                :class="{ active: selectedTable?.status === status.value }"
                @click="updateTableStatus(status.value)"
              >
                <i :class="status.icon"></i>
                <span>{{ status.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import SidebarMenu from '@/components/dashboard/SidebarMenu.vue';

interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'needs_cleaning';
  location: 'indoor' | 'outdoor' | 'terrace' | 'private';
  currentOrderId?: string;
  lastUsed?: Date;
  notes?: string;
}

export default defineComponent({
  name: 'TablesView',
  components: {
    SidebarMenu
  },
  setup() {
    const showLayoutView = ref(false);
    const showAddTable = ref(false);
    const showQRCode = ref(false);
    const showStatusChange = ref(false);
    const searchTerm = ref('');
    const selectedStatus = ref('');
    const selectedLocation = ref('');
    const editingTable = ref<Table | null>(null);
    const selectedTable = ref<Table | null>(null);

    // Dados mock
    const tables = ref<Table[]>([
      {
        id: '1',
        number: 1,
        capacity: 2,
        status: 'available',
        location: 'indoor',
        lastUsed: new Date('2025-01-18T19:30:00')
      },
      {
        id: '2',
        number: 2,
        capacity: 4,
        status: 'occupied',
        location: 'indoor',
        currentOrderId: 'ORD-001',
        lastUsed: new Date('2025-01-19T18:00:00')
      },
      {
        id: '3',
        number: 3,
        capacity: 6,
        status: 'reserved',
        location: 'outdoor',
        notes: 'Mesa preferida para famílias'
      },
      {
        id: '4',
        number: 4,
        capacity: 2,
        status: 'needs_cleaning',
        location: 'terrace',
        lastUsed: new Date('2025-01-19T16:45:00')
      },
      {
        id: '5',
        number: 5,
        capacity: 8,
        status: 'available',
        location: 'private',
        notes: 'Sala privativa para eventos'
      }
    ]);

    const tableForm = ref({
      number: 0,
      capacity: 2,
      status: 'available' as Table['status'],
      location: '' as Table['location'],
      notes: ''
    });

    const statusOptions = [
      { value: 'available', label: 'Disponível', icon: 'fas fa-check-circle' },
      { value: 'occupied', label: 'Ocupada', icon: 'fas fa-users' },
      { value: 'reserved', label: 'Reservada', icon: 'fas fa-bookmark' },
      { value: 'needs_cleaning', label: 'Precisa Limpeza', icon: 'fas fa-broom' }
    ];

    // Computed
    const filteredTables = computed(() => {
      let filtered = tables.value;
      
      if (searchTerm.value) {
        filtered = filtered.filter(table => 
          table.number.toString().includes(searchTerm.value) ||
          (table.notes && table.notes.toLowerCase().includes(searchTerm.value.toLowerCase()))
        );
      }
      
      if (selectedStatus.value) {
        filtered = filtered.filter(table => table.status === selectedStatus.value);
      }
      
      if (selectedLocation.value) {
        filtered = filtered.filter(table => table.location === selectedLocation.value);
      }
      
      return filtered.sort((a, b) => a.number - b.number);
    });

    // Methods
    const getTablesByStatus = (status: string) => {
      return tables.value.filter(table => table.status === status);
    };

    const getStatusText = (status: string) => {
      const statusMap = {
        available: 'Disponível',
        occupied: 'Ocupada',
        reserved: 'Reservada',
        needs_cleaning: 'Precisa Limpeza'
      };
      return statusMap[status as keyof typeof statusMap] || status;
    };

    const getLocationText = (location: string) => {
      const locationMap = {
        indoor: 'Área Interna',
        outdoor: 'Área Externa',
        terrace: 'Terraço',
        private: 'Sala Privada'
      };
      return locationMap[location as keyof typeof locationMap] || location;
    };

    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    };

    const selectTable = (table: Table) => {
      selectedTable.value = table;
      // Aqui poderia abrir um modal com mais detalhes da mesa
    };

    const editTable = (table: Table) => {
      editingTable.value = table;
      tableForm.value = {
        number: table.number,
        capacity: table.capacity,
        status: table.status,
        location: table.location,
        notes: table.notes || ''
      };
      showAddTable.value = true;
    };

    const deleteTable = (table: Table) => {
      if (confirm(`Tem certeza que deseja excluir a Mesa ${table.number}?`)) {
        const index = tables.value.findIndex(t => t.id === table.id);
        if (index > -1) {
          tables.value.splice(index, 1);
        }
      }
    };

    const generateQRCode = (table: Table) => {
      selectedTable.value = table;
      showQRCode.value = true;
    };

    const changeTableStatus = (table: Table) => {
      selectedTable.value = table;
      showStatusChange.value = true;
    };

    const updateTableStatus = (newStatus: string) => {
      if (selectedTable.value) {
        selectedTable.value.status = newStatus as Table['status'];
        showStatusChange.value = false;
      }
    };

    const saveTable = () => {
      if (editingTable.value) {
        // Editando mesa existente
        const index = tables.value.findIndex(t => t.id === editingTable.value!.id);
        if (index > -1) {
          tables.value[index] = {
            ...editingTable.value,
            ...tableForm.value
          };
        }
      } else {
        // Adicionando nova mesa
        const newTable: Table = {
          id: Date.now().toString(),
          ...tableForm.value,
          location: tableForm.value.location as Table['location']
        };
        tables.value.push(newTable);
      }
      
      // Reset form
      tableForm.value = {
        number: 0,
        capacity: 2,
        status: 'available',
        location: '' as Table['location'],
        notes: ''
      };
      editingTable.value = null;
      showAddTable.value = false;
    };

    return {
      showLayoutView,
      showAddTable,
      showQRCode,
      showStatusChange,
      searchTerm,
      selectedStatus,
      selectedLocation,
      editingTable,
      selectedTable,
      tables,
      tableForm,
      statusOptions,
      filteredTables,
      getTablesByStatus,
      getStatusText,
      getLocationText,
      formatDate,
      selectTable,
      editTable,
      deleteTable,
      generateQRCode,
      changeTableStatus,
      updateTableStatus,
      saveTable
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
  padding: 2rem;
  overflow-y: auto;
}

/* Header da página */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

/* Estatísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
}

.stat-icon.available { background: #10b981; }
.stat-icon.occupied { background: #f59e0b; }
.stat-icon.reserved { background: #3b82f6; }
.stat-icon.cleaning { background: #ef4444; }

.stat-info h3 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.25rem;
}

.stat-info p {
  color: #718096;
  margin: 0;
  font-size: 0.9rem;
}

/* Botões */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-primary {
  background: #1a73e8;
  color: white;
}

.btn-primary:hover {
  background: #1557b0;
}

.btn-outline {
  background: white;
  color: #1a73e8;
  border: 2px solid #1a73e8;
}

.btn-outline:hover {
  background: #1a73e8;
  color: white;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  border: none;
  background: #f7fafc;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #e2e8f0;
}

.btn-icon.danger {
  color: #e53e3e;
}

.btn-icon.danger:hover {
  background: #fed7d7;
}

/* Filtros */
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: #1a73e8;
}

.status-filter, .location-filter {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  min-width: 160px;
}

/* Layout View */
.layout-view {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.layout-view h3 {
  margin: 0 0 2rem;
  color: #1a202c;
  font-size: 1.5rem;
}

.restaurant-layout {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 1rem;
  min-height: 400px;
  background: #f7fafc;
  padding: 2rem;
  border-radius: 0.5rem;
  position: relative;
}

.table-layout-item {
  position: relative;
  background: white;
  border-radius: 50%;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  border: 3px solid;
}

.table-layout-item.status-available { border-color: #10b981; }
.table-layout-item.status-occupied { border-color: #f59e0b; }
.table-layout-item.status-reserved { border-color: #3b82f6; }
.table-layout-item.status-needs_cleaning { border-color: #ef4444; }

.table-layout-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.table-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.table-number {
  font-weight: 700;
  font-size: 1.1rem;
  color: #1a202c;
}

.table-capacity {
  font-size: 0.75rem;
  color: #718096;
}

.table-status-indicator {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
}

.table-status-indicator.available { background: #10b981; }
.table-status-indicator.occupied { background: #f59e0b; }
.table-status-indicator.reserved { background: #3b82f6; }
.table-status-indicator.needs_cleaning { background: #ef4444; }

.layout-legend {
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;
}

.legend-color {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
}

.legend-color.available { background: #10b981; }
.legend-color.occupied { background: #f59e0b; }
.legend-color.reserved { background: #3b82f6; }
.legend-color.needs_cleaning { background: #ef4444; }

/* Grid de mesas */
.tables-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.table-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid;
}

.table-card.status-available { border-left-color: #10b981; }
.table-card.status-occupied { border-left-color: #f59e0b; }
.table-card.status-reserved { border-left-color: #3b82f6; }
.table-card.status-needs_cleaning { border-left-color: #ef4444; }

.table-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 1.5rem 1rem;
}

.table-main-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.5rem;
}

.table-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.table-details span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #718096;
}

.table-details i {
  width: 1rem;
  text-align: center;
}

.table-status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table-status.available {
  background: #d1fae5;
  color: #065f46;
}

.table-status.occupied {
  background: #fef3c7;
  color: #92400e;
}

.table-status.reserved {
  background: #dbeafe;
  color: #1e40af;
}

.table-status.needs_cleaning {
  background: #fee2e2;
  color: #991b1b;
}

.table-info {
  padding: 0 1.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.info-row .label {
  color: #718096;
  font-weight: 500;
}

.info-row .value {
  color: #1a202c;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: #f7fafc;
  border-top: 1px solid #e2e8f0;
}

/* Card para adicionar mesa */
.add-table {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  border: 2px dashed #e2e8f0;
  background: #f7fafc;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 2px dashed #e2e8f0;
}

.add-table:hover {
  border-color: #1a73e8;
  background: #ebf8ff;
  transform: none;
}

.add-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: #1a73e8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.add-table p {
  color: #718096;
  font-weight: 500;
  margin: 0;
}

/* Modais */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.qr-modal {
  max-width: 400px;
}

.status-modal {
  max-width: 350px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #a0aec0;
  cursor: pointer;
  padding: 0.25rem;
}

.modal-close:hover {
  color: #718096;
}

.modal-body {
  padding: 1.5rem;
}

/* QR Code Modal */
.qr-code-container {
  text-align: center;
}

.qr-code-placeholder {
  background: #f7fafc;
  border: 2px dashed #e2e8f0;
  border-radius: 0.5rem;
  padding: 3rem 2rem;
  margin-bottom: 1.5rem;
}

.qr-code-placeholder i {
  font-size: 4rem;
  color: #a0aec0;
  margin-bottom: 1rem;
}

.qr-code-placeholder p {
  font-size: 1.1rem;
  font-weight: 600;
  color: #4a5568;
  margin: 0 0 0.5rem;
}

.qr-code-placeholder small {
  color: #718096;
}

.qr-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Status Modal */
.status-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.status-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.status-option:hover {
  border-color: #1a73e8;
}

.status-option.active {
  border-color: #1a73e8;
  background: #ebf8ff;
}

.status-option i {
  font-size: 1.5rem;
  color: #4a5568;
}

.status-option span {
  font-size: 0.9rem;
  font-weight: 500;
  color: #4a5568;
}

/* Formulários */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #1a73e8;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

/* Responsividade */
@media (max-width: 900px) {
  .dashboard-layout {
    flex-direction: column;
  }
  
  .dashboard-content {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .tables-grid {
    grid-template-columns: 1fr;
  }
  
  .restaurant-layout {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .status-options {
    grid-template-columns: 1fr;
  }
  
  .qr-actions {
    flex-direction: column;
  }
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .restaurant-layout {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .layout-legend {
    flex-wrap: wrap;
    gap: 1rem;
  }
}
</style>
