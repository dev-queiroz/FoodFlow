<template>
  <header class="garcom-header">
    <div class="container">
      <nav>
        <router-link to="/garcom" class="logo">Garçom</router-link>
        <div class="nav-items">
          <button 
            class="theme-toggle"
            @click="toggleTheme"
            :title="darkMode ? 'Modo Claro' : 'Modo Escuro'"
          >
            {{ darkMode ? '☀️' : '🌙' }}
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      darkMode: localStorage.getItem('darkMode') === 'true'
    }
  },
  created() {
    document.documentElement.classList.toggle('dark', this.darkMode);
  },
  methods: {
    toggleTheme() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('darkMode', this.darkMode);
      document.documentElement.classList.toggle('dark', this.darkMode);
    }
  }
}
</script>

<style scoped>
.garcom-header {
  background: var(--primary);
  color: white;
  padding: 1rem 0;
}

/* Reuse same styles as AdminHeader */
.container,
nav,
.logo,
.theme-toggle {
  /* Same styles as AdminHeader */
}
</style>
