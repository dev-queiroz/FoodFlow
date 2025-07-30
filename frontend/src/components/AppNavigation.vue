<template>
  <nav class="bg-gray-800 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-xl font-bold">FoodFlow</div>
      <div class="flex space-x-4">
        <router-link 
          to="/" 
          class="px-3 py-2 rounded hover:bg-gray-700"
          active-class="bg-gray-700"
        >
          Menu Cliente
        </router-link>
        <router-link 
          to="/waiter" 
          class="px-3 py-2 rounded hover:bg-gray-700"
          active-class="bg-gray-700"
        >
          Garçom
        </router-link>
        <router-link 
          to="/kitchen" 
          class="px-3 py-2 rounded hover:bg-gray-700"
          active-class="bg-gray-700"
        >
          Cozinha
        </router-link>
        <router-link 
          to="/notifications" 
          class="px-3 py-2 rounded hover:bg-gray-700"
          active-class="bg-gray-700"
        >
          Notificações
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppNavigation'
});
</script>
