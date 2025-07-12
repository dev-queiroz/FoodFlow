<template>
  <header class="admin-header">
    <div class="container">
      <nav>
        <router-link to="/admin" class="logo">Admin</router-link>
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
.admin-header {
  background: var(--primary);
  color: white;
  padding: 1rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-weight: bold;
  font-size: 1.5rem;
  color: white;
  text-decoration: none;
}

.theme-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: rgba(255,255,255,0.1);
}
</style>
