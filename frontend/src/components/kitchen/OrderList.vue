<template>
  <div class="order-list">
    <div v-for="order in orders" :key="order.id" class="order-item">
      <h3>Order #{{ order.id }}</h3>
      <p>Status: {{ order.status }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Order } from '@/types/order';

export default defineComponent({
  name: 'OrderList',
  props: {
    orders: {
      type: Array as PropType<Order[]>,
      required: true
    }
  }
});
</script>

<style scoped>
.order-list {
  @apply space-y-4;
}
.order-item {
  @apply p-4 bg-white rounded-lg shadow;
}
</style>
