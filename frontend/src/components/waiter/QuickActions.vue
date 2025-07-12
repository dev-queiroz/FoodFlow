<template>
  <div class="quick-actions grid grid-cols-2 gap-3">
    <button 
      v-for="action in actions" 
      :key="action.id"
      @click="$emit(action.event)"
      class="p-3 bg-white rounded-lg shadow flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
    >
      <component :is="action.icon" class="h-6 w-6 text-primary-500 mb-1" />
      <span class="text-sm font-medium">{{ action.label }}</span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { 
  PlusIcon, 
  MinusIcon, 
  ClockIcon, 
  CheckCircleIcon 
} from '@heroicons/vue/outline';

export default defineComponent({
  name: 'QuickActions',
  setup() {
    const actions = [
      { id: 1, label: 'New Order', icon: PlusIcon, event: 'new-order' },
      { id: 2, label: 'Cancel', icon: MinusIcon, event: 'cancel-order' },
      { id: 3, label: 'Delay', icon: ClockIcon, event: 'delay-order' },
      { id: 4, label: 'Complete', icon: CheckCircleIcon, event: 'complete-order' },
    ];

    return { actions };
  }
});
</script>

<style scoped>
.quick-actions {
  @apply p-4;
}
</style>
