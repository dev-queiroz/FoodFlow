<template>
  <div class="app-container">
    <!-- Só mostra NavigationBar nas páginas específicas (não auth e não home) -->
    <NavigationBar v-if="showNavigationBar" />
    
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavigationBar from './components/NavigationBar.vue'

const route = useRoute()

// Mostra NavigationBar apenas em páginas internas (não auth e não home)
const showNavigationBar = computed(() => {
  const path = route.path
  // Não mostra na home (que tem MainHeader)
  if (path === '/') return false
  // Não mostra nas páginas de auth
  if (path.startsWith('/auth')) return false
  // Mostra nas demais páginas
  return true
})
</script>

<style>
:root {
  /* Light theme */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f7fa;
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  --border-color: #e0e0e0;
  
  /* Dark theme */
  &.dark {
    --bg-primary: #121212;
    --bg-secondary: #1e1e1e;
    --text-primary: #f5f5f5;
    --text-secondary: #aaaaaa;
    --border-color: #333333;
    
    /* Component-specific dark mode overrides */
    --card-bg: #2d2d2d;
    --card-hover: #383838;
  }
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background 0.3s, color 0.3s;
}

.app-container {
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
}

/* Para páginas internas com navigation-bar */
.app-container:has(.navigation-bar) {
  padding: 1rem;
  background: var(--bg-secondary);
}

/* Para páginas sem navigation-bar (home e auth) */
.app-container:not(:has(.navigation-bar)) {
  padding: 0;
  background: transparent;
}

.full-width {
  width: 100vw;
  margin-left: calc(50% - 50vw);
}

/* Transição entre rotas */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
