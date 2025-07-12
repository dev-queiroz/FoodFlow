<template>
  <div v-if="order" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-start">
          <h2 class="text-xl font-bold">Order #{{ order.id }}</h2>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div class="mt-4 space-y-4">
          <div>
            <h3 class="font-medium">Items</h3>
            <ul class="mt-2 space-y-2">
              <li v-for="item in order.items" :key="item.id" class="flex justify-between">
                <span>{{ item.name }}</span>
                <span>{{ item.quantity }} × {{ item.price }}</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-medium">Status</h3>
            <select v-model="order.status" class="mt-2 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
          
          <button 
            @click="$emit('update:order', order)"
            class="mt-4 w-full bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600"
          >
            Update Order
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Order } from '@/types/order';

export default defineComponent({
  name: 'OrderDetailsModal',
  props: {
    order: {
      type: Object as PropType<Order>,
      required: true
    }
  }
});
</script>

<style scoped>
/* Modal styles */
</style>
