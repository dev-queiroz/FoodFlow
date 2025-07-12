import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';
import App from './App.vue';
import router from './router';
import './main.css';
import './assets/animations.css';

// Importa o registro do Service Worker apenas no ambiente de produção
if (import.meta.env.PROD) {
  import('./utils/registerServiceWorker');
}

const app = createApp(App);
const head = createHead();

// Adiciona plugins globais
app.use(createPinia());
app.use(router);
app.use(head);

app.mount('#app');
