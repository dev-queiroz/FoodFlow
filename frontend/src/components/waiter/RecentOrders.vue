<template>
  <div class="recent-orders">
    <h3 class="text-lg font-medium mb-4">Recent Orders</h3>
    <div v-for="order in orders" :key="order.id" class="order-item p-3 mb-2 bg-white rounded shadow">
      <div class="flex justify-between">
        <span>Table {{ order.tableNumber }}</span>
        <span class="font-medium">{{ order.status }}</span>
      </div>
      <div class="text-sm text-gray-500 mt-1">
        {{ order.items.length }} items • {{ order.time }} minutes ago
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Order } from '@/types/order';

export default defineComponent({
  name: 'RecentOrders',
  props: {
    orders: {
      type: Array as PropType<Order[]>,
      required: true
    }
  }
});
</script>

<style scoped>
.recent-orders {
  @apply p-4 bg-gray-50 rounded-lg;
}
.order-item {
  @apply transition-colors hover:bg-gray-100;
}
</style>
