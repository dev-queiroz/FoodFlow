<template>
  <div class="dashboard-layout">
    <SidebarMenu />
    <div class="dashboard-content">
      <!-- Header da página -->
      <div class="page-header">
        <h1>Reservas Online</h1>
        <div class="header-actions">
          <button class="btn btn-outline" @click="refreshReservations">
            <i class="fas fa-sync-alt"></i>
            Atualizar
          </button>
          <button class="btn btn-primary" @click="showAddReservation = true">
            <i class="fas fa-plus"></i>
            Nova Reserva
          </button>
        </div>
      </div>

      <!-- Estatísticas -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-calendar-check"></i>
          </div>
          <div class="stat-info">
            <h3>{{ todayReservations }}</h3>
            <p>Reservas hoje</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon pending">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stat-info">
            <h3>{{ pendingReservations }}</h3>
            <p>Aguardando confirmação</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon confirmed">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-info">
            <h3>{{ confirmedReservations }}</h3>
            <p>Confirmadas</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon cancelled">
            <i class="fas fa-times-circle"></i>
          </div>
          <div class="stat-info">
            <h3>{{ cancelledReservations }}</h3>
            <p>Canceladas</p>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Buscar por nome ou telefone..." 
            v-model="searchTerm"
          >
        </div>
        <input type="date" v-model="selectedDate" class="date-filter">
        <select v-model="selectedStatus" class="status-filter">
          <option value="">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="confirmed">Confirmada</option>
          <option value="cancelled">Cancelada</option>
          <option value="completed">Concluída</option>
        </select>
        <select v-model="selectedTable" class="table-filter">
          <option value="">Todas as mesas</option>
          <option v-for="table in tables" :key="table.id" :value="table.id">
            Mesa {{ table.number }} ({{ table.capacity }} pessoas)
          </option>
        </select>
      </div>

      <!-- Lista de reservas -->
      <div class="reservations-section">
        <div class="section-header">
          <h2>Reservas</h2>
          <div class="view-toggle">
            <button 
              class="toggle-btn" 
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              <i class="fas fa-list"></i>
              Lista
            </button>
            <button 
              class="toggle-btn" 
              :class="{ active: viewMode === 'calendar' }"
              @click="viewMode = 'calendar'"
            >
              <i class="fas fa-calendar"></i>
              Calendário
            </button>
          </div>
        </div>

        <!-- Visualização em lista -->
        <div v-if="viewMode === 'list'" class="reservations-list">
          <div 
            v-for="reservation in filteredReservations" 
            :key="reservation.id" 
            class="reservation-card"
          >
            <div class="reservation-header">
              <div class="customer-info">
                <h3>{{ reservation.customerName }}</h3>
                <p>{{ reservation.phone }}</p>
              </div>
              <div class="reservation-status">
                <span class="status-badge" :class="reservation.status">
                  {{ getStatusLabel(reservation.status) }}
                </span>
              </div>
            </div>
            
            <div class="reservation-details">
              <div class="detail-item">
                <i class="fas fa-calendar"></i>
                <span>{{ formatDate(reservation.date) }}</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-clock"></i>
                <span>{{ reservation.time }}</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-users"></i>
                <span>{{ reservation.guests }} pessoas</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-chair"></i>
                <span>Mesa {{ getTableNumber(reservation.tableId) }}</span>
              </div>
            </div>

            <div v-if="reservation.notes" class="reservation-notes">
              <i class="fas fa-sticky-note"></i>
              <span>{{ reservation.notes }}</span>
            </div>

            <div class="reservation-actions">
              <button 
                v-if="reservation.status === 'pending'" 
                class="btn btn-success btn-sm" 
                @click="confirmReservation(reservation)"
              >
                <i class="fas fa-check"></i>
                Confirmar
              </button>
              <button 
                v-if="reservation.status === 'confirmed'" 
                class="btn btn-primary btn-sm" 
                @click="completeReservation(reservation)"
              >
                <i class="fas fa-user-check"></i>
                Cliente chegou
              </button>
              <button 
                class="btn btn-outline btn-sm" 
                @click="editReservation(reservation)"
              >
                <i class="fas fa-edit"></i>
                Editar
              </button>
              <button 
                v-if="reservation.status !== 'cancelled'" 
                class="btn btn-danger btn-sm" 
                @click="cancelReservation(reservation)"
              >
                <i class="fas fa-times"></i>
                Cancelar
              </button>
            </div>
          </div>

          <div v-if="filteredReservations.length === 0" class="empty-state">
            <i class="fas fa-calendar-times"></i>
            <p>Nenhuma reserva encontrada</p>
          </div>
        </div>

        <!-- Visualização em calendário -->
        <div v-if="viewMode === 'calendar'" class="calendar-view">
          <div class="calendar-header">
            <button class="btn btn-outline" @click="previousWeek">
              <i class="fas fa-chevron-left"></i>
            </button>
            <h3>{{ currentWeekLabel }}</h3>
            <button class="btn btn-outline" @click="nextWeek">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
          
          <div class="calendar-grid">
            <div v-for="day in weekDays" :key="day.date" class="day-column">
              <div class="day-header">
                <h4>{{ day.dayName }}</h4>
                <span>{{ day.date }}</span>
              </div>
              <div class="time-slots">
                <div 
                  v-for="slot in timeSlots" 
                  :key="slot" 
                  class="time-slot"
                >
                  <span class="slot-time">{{ slot }}</span>
                  <div 
                    v-for="reservation in getReservationsForSlot(day.fullDate, slot)" 
                    :key="reservation.id"
                    class="slot-reservation"
                    :class="reservation.status"
                    @click="viewReservationDetails(reservation)"
                  >
                    <div class="reservation-summary">
                      <strong>{{ reservation.customerName }}</strong>
                      <span>{{ reservation.guests }}p - Mesa {{ getTableNumber(reservation.tableId) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para adicionar/editar reserva -->
      <div v-if="showAddReservation" class="modal-overlay" @click="showAddReservation = false">
        <div class="modal large" @click.stop>
          <div class="modal-header">
            <h3>{{ editingReservation ? 'Editar Reserva' : 'Nova Reserva' }}</h3>
            <button class="modal-close" @click="showAddReservation = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveReservation">
              <div class="form-row">
                <div class="form-group">
                  <label>Nome do Cliente:</label>
                  <input type="text" v-model="reservationForm.customerName" required>
                </div>
                <div class="form-group">
                  <label>Telefone:</label>
                  <input type="tel" v-model="reservationForm.phone" required>
                </div>
              </div>
              
              <div class="form-group">
                <label>E-mail:</label>
                <input type="email" v-model="reservationForm.email">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Data:</label>
                  <input type="date" v-model="reservationForm.date" required>
                </div>
                <div class="form-group">
                  <label>Horário:</label>
                  <select v-model="reservationForm.time" required>
                    <option value="">Selecione um horário</option>
                    <option v-for="slot in timeSlots" :key="slot" :value="slot">
                      {{ slot }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Número de Pessoas:</label>
                  <input type="number" min="1" max="20" v-model="reservationForm.guests" required>
                </div>
                <div class="form-group">
                  <label>Mesa Preferida:</label>
                  <select v-model="reservationForm.tableId">
                    <option value="">Qualquer mesa disponível</option>
                    <option v-for="table in tables" :key="table.id" :value="table.id">
                      Mesa {{ table.number }} ({{ table.capacity }} pessoas)
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>Observações:</label>
                <textarea v-model="reservationForm.notes" rows="3" placeholder="Aniversário, preferências alimentares, etc."></textarea>
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn-outline" @click="showAddReservation = false">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-primary">
                  {{ editingReservation ? 'Salvar' : 'Criar Reserva' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import SidebarMenu from '@/components/dashboard/SidebarMenu.vue';

interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  tableId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
}

interface Table {
  id: string;
  number: number;
  capacity: number;
  location: string;
}

export default defineComponent({
  name: 'ReservationsView',
  components: {
    SidebarMenu
  },
  setup() {
    const searchTerm = ref('');
    const selectedDate = ref('');
    const selectedStatus = ref('');
    const selectedTable = ref('');
    const viewMode = ref<'list' | 'calendar'>('list');
    const showAddReservation = ref(false);
    const editingReservation = ref<Reservation | null>(null);
    const currentWeek = ref(new Date());

    // Dados mock
    const tables = ref<Table[]>([
      { id: '1', number: 1, capacity: 2, location: 'Salão Principal' },
      { id: '2', number: 2, capacity: 4, location: 'Salão Principal' },
      { id: '3', number: 3, capacity: 4, location: 'Salão Principal' },
      { id: '4', number: 4, capacity: 6, location: 'Salão Principal' },
      { id: '5', number: 5, capacity: 8, location: 'Salão Principal' },
      { id: '6', number: 6, capacity: 2, location: 'Terraço' },
      { id: '7', number: 7, capacity: 4, location: 'Terraço' }
    ]);

    const reservations = ref<Reservation[]>([
      {
        id: '1',
        customerName: 'Marina Oliveira',
        phone: '(12) 3456-7891',
        email: 'maria@email.com',
        date: '2025-07-19',
        time: '19:00',
        guests: 4,
        tableId: '2',
        status: 'confirmed',
        notes: 'Aniversário de casamento',
        createdAt: '2025-07-18T10:00:00Z'
      },
      {
        id: '2',
        customerName: 'João Santos',
        phone: '(11) 88888-2222',
        email: 'joao@email.com',
        date: '2025-07-19',
        time: '20:30',
        guests: 2,
        tableId: '1',
        status: 'pending',
        createdAt: '2025-07-19T08:30:00Z'
      },
      {
        id: '3',
        customerName: 'Ana Costa',
        phone: '(11) 77777-3333',
        date: '2025-07-20',
        time: '19:30',
        guests: 6,
        tableId: '4',
        status: 'confirmed',
        notes: 'Reunião de negócios',
        createdAt: '2025-07-18T15:20:00Z'
      },
      {
        id: '4',
        customerName: 'Douglas Queiroz',
        phone: '(98) 7654-3210',
        date: '2025-07-19',
        time: '18:00',
        guests: 8,
        tableId: '5',
        status: 'cancelled',
        createdAt: '2025-07-17T12:00:00Z'
      }
    ]);

    const timeSlots = [
      '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
    ];

    const reservationForm = ref({
      customerName: '',
      phone: '',
      email: '',
      date: '',
      time: '',
      guests: 2,
      tableId: '',
      notes: ''
    });

    // Computed
    const filteredReservations = computed(() => {
      let filtered = reservations.value;
      
      if (searchTerm.value) {
        filtered = filtered.filter(reservation => 
          reservation.customerName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          reservation.phone.includes(searchTerm.value)
        );
      }
      
      if (selectedDate.value) {
        filtered = filtered.filter(reservation => reservation.date === selectedDate.value);
      }
      
      if (selectedStatus.value) {
        filtered = filtered.filter(reservation => reservation.status === selectedStatus.value);
      }
      
      if (selectedTable.value) {
        filtered = filtered.filter(reservation => reservation.tableId === selectedTable.value);
      }
      
      return filtered.sort((a, b) => {
        if (a.date !== b.date) {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        return a.time.localeCompare(b.time);
      });
    });

    const todayReservations = computed(() => {
      const today = new Date().toISOString().split('T')[0];
      return reservations.value.filter(r => r.date === today).length;
    });

    const pendingReservations = computed(() => {
      return reservations.value.filter(r => r.status === 'pending').length;
    });

    const confirmedReservations = computed(() => {
      return reservations.value.filter(r => r.status === 'confirmed').length;
    });

    const cancelledReservations = computed(() => {
      return reservations.value.filter(r => r.status === 'cancelled').length;
    });

    const weekDays = computed(() => {
      const days = [];
      const startOfWeek = new Date(currentWeek.value);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        
        days.push({
          dayName: day.toLocaleDateString('pt-BR', { weekday: 'short' }),
          date: day.getDate().toString(),
          fullDate: day.toISOString().split('T')[0]
        });
      }
      
      return days;
    });

    const currentWeekLabel = computed(() => {
      const start = new Date(currentWeek.value);
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      
      return `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}`;
    });

    // Methods
    const getStatusLabel = (status: string) => {
      const labels = {
        pending: 'Pendente',
        confirmed: 'Confirmada',
        cancelled: 'Cancelada',
        completed: 'Concluída'
      };
      return labels[status as keyof typeof labels] || status;
    };

    const getTableNumber = (tableId: string) => {
      const table = tables.value.find(t => t.id === tableId);
      return table ? table.number : 'N/A';
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    };

    const getReservationsForSlot = (date: string, time: string) => {
      return reservations.value.filter(r => r.date === date && r.time === time);
    };

    const confirmReservation = (reservation: Reservation) => {
      reservation.status = 'confirmed';
    };

    const completeReservation = (reservation: Reservation) => {
      reservation.status = 'completed';
    };

    const cancelReservation = (reservation: Reservation) => {
      if (confirm(`Tem certeza que deseja cancelar a reserva de ${reservation.customerName}?`)) {
        reservation.status = 'cancelled';
      }
    };

    const editReservation = (reservation: Reservation) => {
      editingReservation.value = reservation;
      reservationForm.value = { ...reservation };
      showAddReservation.value = true;
    };

    const saveReservation = () => {
      if (editingReservation.value) {
        // Editando reserva existente
        const index = reservations.value.findIndex(r => r.id === editingReservation.value!.id);
        if (index > -1) {
          reservations.value[index] = { 
            ...editingReservation.value, 
            ...reservationForm.value,
            status: editingReservation.value.status
          };
        }
      } else {
        // Adicionando nova reserva
        const newReservation: Reservation = {
          id: Date.now().toString(),
          ...reservationForm.value,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        reservations.value.push(newReservation);
      }
      
      // Reset form
      reservationForm.value = {
        customerName: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        guests: 2,
        tableId: '',
        notes: ''
      };
      editingReservation.value = null;
      showAddReservation.value = false;
    };

    const refreshReservations = () => {
      console.log('Atualizando reservas...');
    };

    const previousWeek = () => {
      const newWeek = new Date(currentWeek.value);
      newWeek.setDate(newWeek.getDate() - 7);
      currentWeek.value = newWeek;
    };

    const nextWeek = () => {
      const newWeek = new Date(currentWeek.value);
      newWeek.setDate(newWeek.getDate() + 7);
      currentWeek.value = newWeek;
    };

    const viewReservationDetails = (reservation: Reservation) => {
      editReservation(reservation);
    };

    return {
      searchTerm,
      selectedDate,
      selectedStatus,
      selectedTable,
      viewMode,
      showAddReservation,
      editingReservation,
      tables,
      reservations,
      timeSlots,
      reservationForm,
      filteredReservations,
      todayReservations,
      pendingReservations,
      confirmedReservations,
      cancelledReservations,
      weekDays,
      currentWeekLabel,
      getStatusLabel,
      getTableNumber,
      formatDate,
      getReservationsForSlot,
      confirmReservation,
      completeReservation,
      cancelReservation,
      editReservation,
      saveReservation,
      refreshReservations,
      previousWeek,
      nextWeek,
      viewReservationDetails
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
  border-radius: 0.5rem;
  background: #1a73e8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.stat-icon.pending {
  background: #f59e0b;
}

.stat-icon.confirmed {
  background: #059669;
}

.stat-icon.cancelled {
  background: #dc2626;
}

.stat-info h3 {
  font-size: 2rem;
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

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
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
  background: #059669;
  color: white;
}

.btn-success:hover {
  background: #047857;
}

.btn-danger {
  background: #dc2626;
  color: white;
}

.btn-danger:hover {
  background: #b91c1c;
}

/* Filtros */
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
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

.date-filter,
.status-filter,
.table-filter {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  min-width: 150px;
}

/* Seção de reservas */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.view-toggle {
  display: flex;
  background: #f7fafc;
  border-radius: 0.5rem;
  padding: 0.25rem;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  border-radius: 0.375rem;
  color: #718096;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn.active {
  background: white;
  color: #1a73e8;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Lista de reservas */
.reservations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.reservation-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.reservation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.reservation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.customer-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.25rem;
}

.customer-info p {
  color: #718096;
  margin: 0;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.confirmed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.completed {
  background: #e0e7ff;
  color: #3730a3;
}

.reservation-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
}

.detail-item i {
  color: #1a73e8;
  width: 1rem;
}

.reservation-notes {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  color: #4a5568;
  font-style: italic;
}

.reservation-notes i {
  color: #f59e0b;
  margin-top: 0.125rem;
}

.reservation-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #718096;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #e2e8f0;
}

/* Visualização em calendário */
.calendar-view {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
}

.calendar-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  min-height: 600px;
}

.day-column {
  border-right: 1px solid #e2e8f0;
}

.day-column:last-child {
  border-right: none;
}

.day-header {
  padding: 1rem;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
  text-align: center;
}

.day-header h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.25rem;
  text-transform: uppercase;
}

.day-header span {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a73e8;
}

.time-slots {
  padding: 0.5rem;
}

.time-slot {
  min-height: 60px;
  border-bottom: 1px solid #f1f5f9;
  padding: 0.5rem 0;
}

.slot-time {
  font-size: 0.75rem;
  color: #718096;
  font-weight: 500;
}

.slot-reservation {
  margin-top: 0.25rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.slot-reservation.pending {
  background: #fef3c7;
  border-left: 3px solid #f59e0b;
}

.slot-reservation.confirmed {
  background: #d1fae5;
  border-left: 3px solid #059669;
}

.slot-reservation.cancelled {
  background: #fee2e2;
  border-left: 3px solid #dc2626;
}

.slot-reservation.completed {
  background: #e0e7ff;
  border-left: 3px solid #3730a3;
}

.slot-reservation:hover {
  transform: scale(1.02);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.reservation-summary strong {
  display: block;
  font-size: 0.8rem;
  color: #1a202c;
  margin-bottom: 0.125rem;
}

.reservation-summary span {
  font-size: 0.7rem;
  color: #4a5568;
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
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal.large {
  max-width: 800px;
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
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .calendar-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .day-column:nth-child(n+5) {
    display: none;
  }
}

@media (max-width: 768px) {
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
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .reservation-details {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .calendar-grid {
    grid-template-columns: 1fr;
  }
  
  .view-toggle {
    width: 100%;
    justify-content: center;
  }
}
</style>
