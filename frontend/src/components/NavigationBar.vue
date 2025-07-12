<template>
  <nav class="navigation-bar slide-up">
    <router-link 
      v-for="link in links" 
      :key="link.name"
      :to="link.path"
      class="nav-link fade-in"
    >
      {{ link.label }}
    </router-link>
  </nav>
</template>

<script setup lang="ts">
const links = [
  { name: 'Home', path: '/', label: 'Menu Digital' },
  { name: 'Garcom', path: '/garcom', label: 'Garçom' },
  { name: 'Cozinha', path: '/cozinha', label: 'Cozinha' },
  { name: 'Admin', path: '/admin', label: 'Admin' }
]
</script>

<style scoped>
.navigation-bar {
  display: flex;
  justify-content: center;
  padding: 1rem;
  background: #2196f3;
  gap: 1rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

.router-link-active {
  font-weight: bold;
  background: rgba(255, 255, 255, 0.3);
}
</style>
