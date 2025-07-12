<template>
  <!-- ... (rest of the template remains the same) -->
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType, watch } from 'vue';
import TableDetailsModal from './TableDetailsModal.vue';

export interface Table {
  id: string;
  number: number | string;
  status: 'available' | 'occupied' | 'reserved' | 'needs_attention';
  capacity: number;
  location?: string;
  lastActivity?: string;
  currentOrder?: string;
  orderTime?: string;
  waiter?: string;
  notes?: string;
}

export default defineComponent({
  name: 'TableList',
  components: {
    TableDetailsModal
  },
  props: {
    tables: {
      type: Array as PropType<Table[]>,
      required: true,
      default: () => []
    }
  },
  emits: ['select-table', 'start-order', 'view-order', 'request-bill', 'provide-assistance', 'edit-table', 'add-table'],
  setup(props, { emit }) {
    // Estado
    const viewMode = ref<'grid' | 'list'>('grid');
    const searchQuery = ref('');
    const statusFilter = ref<string | null>(null);
    const capacityFilter = ref<string | null>(null);
    const selectedTableId = ref<string | null>(null);
    const selectedTable = ref<Table | null>(null);
    const isModalOpen = ref(false);
    const currentPage = ref(1);
    const itemsPerPage = 8;

    // Computed
    const filteredTables = computed(() => {
      return props.tables.filter(table => {
        // Filtro de busca
        const matchesSearch = searchQuery.value === '' || 
          table.number.toString().includes(searchQuery.value) ||
          (table.waiter && table.waiter.toLowerCase().includes(searchQuery.value.toLowerCase()));
        
        // Filtro de status
        const matchesStatus = !statusFilter.value || table.status === statusFilter.value;
        
        // Filtro de capacidade
        let matchesCapacity = true;
        if (capacityFilter.value) {
          const capacity = parseInt(capacityFilter.value, 10);
          if (capacity === 8) {
            matchesCapacity = table.capacity >= capacity;
          } else {
            matchesCapacity = table.capacity === capacity;
          }
        }
        
        return matchesSearch && matchesStatus && matchesCapacity;
      });
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredTables.value.length / itemsPerPage);
    });

    // Métodos
    const getStatusBadgeClass = (status: string) => {
      const classes = {
        available: 'bg-green-100 text-green-800',
        occupied: 'bg-blue-100 text-blue-800',
        reserved: 'bg-yellow-100 text-yellow-800',
        needs_attention: 'bg-red-100 text-red-800'
      };
      return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status: string) => {
      const statusMap: Record<string, string> = {
        available: 'Disponível',
        occupied: 'Ocupada',
        reserved: 'Reservada',
        needs_attention: 'Atenção'
      };
      return statusMap[status] || status;
    };

    const selectTable = (table: Table) => {
      selectedTableId.value = table.id;
      selectedTable.value = { ...table };
      isModalOpen.value = true;
      emit('select-table', table);
    };

    const startOrder = (table: Table) => {
      emit('start-order', table);
    };

    const viewOrder = (table: Table) => {
      emit('view-order', table);
    };

    const requestBill = (table: Table) => {
      emit('request-bill', table);
    };

    const provideAssistance = (table: Table) => {
      emit('provide-assistance', table);
    };

    const editTable = (table: Table) => {
      selectedTable.value = { ...table };
      isModalOpen.value = true;
      emit('edit-table', table);
    };

    const openNewTableModal = () => {
      selectedTable.value = {
        id: 'new',
        number: '',
        status: 'available',
        capacity: 4
      };
      isModalOpen.value = true;
      emit('add-table');
    };

    const closeModal = () => {
      isModalOpen.value = false;
      // Limpa a seleção após um pequeno atraso para a animação
      setTimeout(() => {
        selectedTable.value = null;
      }, 300);
    };

    const updateTable = (updatedTable: Table) => {
      emit('update:table', updatedTable);
      closeModal();
    };

    const formatDuration = (startTime: Date) => {
      const now = new Date();
      const diffMs = now.getTime() - new Date(startTime).getTime();
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    };

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value || 0);
    };

    // Watchers
    watch(currentPage, (newPage) => {
      // Garante que a página atual não exceda o número total de páginas
      if (newPage > totalPages.value) {
        currentPage.value = Math.max(1, totalPages.value);
      }
    });

    return {
      // Refs
      viewMode,
      searchQuery,
      statusFilter,
      capacityFilter,
      selectedTableId,
      selectedTable,
      isModalOpen,
      currentPage,
      itemsPerPage,
      
      // Computed
      filteredTables,
      totalPages,
      
      // Methods
      getStatusBadgeClass,
      getStatusText,
      selectTable,
      startOrder,
      viewOrder,
      requestBill,
      provideAssistance,
      editTable,
      openNewTableModal,
      closeModal,
      updateTable,
      formatDuration,
      formatCurrency
    };
  }
});
</script>
