<template>
  <NavigationBar />
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import NavigationBar from './components/NavigationBar.vue'
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
  padding: 1rem;
  background: var(--bg-secondary);
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
