<template>
  <header class="main-header">
    <div class="container">
      <div class="logo">
        <span class="logo-icon">🍽️</span>
        <span class="logo-text">FoodFlow</span>
      </div>
      <nav class="main-nav">
        <a href="#inicio" class="nav-link" @click.prevent="scrollTo('inicio')">Início</a>
        <a href="#recursos" class="nav-link" @click.prevent="scrollTo('recursos')">Recursos</a>
        <a href="#planos" class="nav-link" @click.prevent="scrollTo('planos')">Planos</a>
        <a href="#testemunhas" class="nav-link" @click.prevent="scrollTo('testemunhas')">Testemunhas</a>
        <a href="/auth/login" class="nav-link highlight">Entrar</a>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainHeader',
  methods: {
    scrollTo(sectionId: string) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
});
</script>

<style scoped>
.main-header {
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #ececec;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  position: sticky;
  top: 0;
  z-index: 100;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1.5rem;
}
.logo {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
}
.logo-icon {
  font-size: 1.7rem;
  margin-right: 0.4rem;
}
.logo-text {
  color: #3d3d3d;
  font-family: 'Montserrat', sans-serif;
}
.main-nav {
  display: flex;
  gap: 1.2rem;
}
.nav-link {
  color: #3d3d3d;
  text-decoration: none;
  font-weight: 500;
  padding: 0.3rem 0.7rem;
  border-radius: 5px;
  transition: background 0.2s, color 0.2s;
}
.nav-link:hover {
  background: #f5f5f5;
  color: #1a73e8;
}
.nav-link.highlight {
  background: #1a73e8;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 1px 5px rgba(26,115,232,0.08);
}
@media (max-width: 600px) {
  .container {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
  }
  .main-nav {
    gap: 0.7rem;
  }
  .logo {
    font-size: 1.2rem;
  }
}
</style>
