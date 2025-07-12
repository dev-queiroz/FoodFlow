<template>
  <div class="not-found">
    <h1>Página não encontrada</h1>
    <p>A página que você está procurando não existe.</p>
    <p>Rota atual: {{ $route.path }}</p>
    <router-link to="/">Voltar para Home</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NotFound'
});
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 0 20px;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

a {
  margin-top: 2rem;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  text-decoration: underline;
}
</style>
