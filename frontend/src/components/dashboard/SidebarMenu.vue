<template>
  <aside class="sidebar-menu">
  <div class="sidebar-logo">
    <span class="logo-icon">🍽️</span>
    <span class="logo-text">FoodFlow</span>
  </div>
  <nav>
    <ul>
      <li v-for="(item, idx) in menuItems" :key="item" class="menu-item">
        <button
          class="menu-btn fade-in"
          :class="{ active: isActiveItem(item) }"
          :style="{'animation-delay': (0.1 + 0.04 * idx) + 's'}"
          @click="handleMenuClick(item)"
        >
          <i :class="getItemIcon(item)"></i>
          {{ item }}
        </button>
      </li>
    </ul>
  </nav>
</aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: 'SidebarMenu',
  data() {
    return {
      menuItems: [
        'Dashboard',
        'Cardápio Digital',
        'Gestão de Pedidos',
        'Gestão de Mesas',
        'Reservas Online',
        'Controle de Estoque',
        'Notificações',
        'Painel de Administração',
        'Painel de Garçom',
        'Painel de Cozinha',
        'Feedback dos Clientes',
        'Personalização',
        'Relatórios'
      ]
    }
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    function handleMenuClick(item: string) {
      switch(item) {
        case 'Dashboard':
          router.push('/dashboard');
          break;
        case 'Cardápio Digital':
          router.push('/menu');
          break;
        case 'Painel de Garçom':
          router.push('/waiter');
          break;
        case 'Painel de Cozinha':
          router.push('/kitchen');
          break;
        case 'Gestão de Pedidos':
          router.push('/orders');
          break;
        case 'Gestão de Mesas':
          router.push('/tables');
          break;
        case 'Reservas Online':
          router.push('/reservations');
          break;
        case 'Controle de Estoque':
          router.push('/estoque');
          break;
        case 'Notificações':
          router.push('/notifications');
          break;
        case 'Painel de Administração':
          router.push('/admin');
          break;
        case 'Feedback dos Clientes':
          router.push('/feedback');
          break;
        case 'Personalização':
          router.push('/personalizacao');
          break;
        case 'Relatórios':
          router.push('/relatorios');
          break;
        default:
          console.log(`${item} - Em desenvolvimento`);
      }
    }

    function isActiveItem(item: string) {
      const currentPath = route.path;
      switch(item) {
        case 'Dashboard':
          return currentPath === '/dashboard';
        case 'Cardápio Digital':
          return currentPath === '/menu';
        case 'Gestão de Pedidos':
          return currentPath === '/orders';
        case 'Gestão de Mesas':
          return currentPath === '/tables';
        case 'Painel de Garçom':
          return currentPath === '/waiter';
        case 'Painel de Cozinha':
          return currentPath === '/kitchen';
        case 'Reservas Online':
          return currentPath === '/reservations';
        default:
          return false;
      }
    }

    function getItemIcon(item: string) {
      const icons: { [key: string]: string } = {
        'Dashboard': 'fas fa-tachometer-alt',
        'Cardápio Digital': 'fas fa-utensils',
        'Gestão de Pedidos': 'fas fa-shopping-cart',
        'Gestão de Mesas': 'fas fa-chair',
        'Reservas Online': 'fas fa-calendar-check',
        'Controle de Estoque': 'fas fa-boxes',
        'Notificações': 'fas fa-bell',
        'Painel de Administração': 'fas fa-cogs',
        'Painel de Garçom': 'fas fa-user-tie',
        'Painel de Cozinha': 'fas fa-fire',
        'Feedback dos Clientes': 'fas fa-comments',
        'Personalização': 'fas fa-palette',
        'Relatórios': 'fas fa-chart-bar'
      };
      return icons[item] || 'fas fa-circle';
    }

    return { 
      handleMenuClick, 
      isActiveItem, 
      getItemIcon 
    };
  }
});
</script>

<style scoped>
:root {
  --primary: #1a73e8;
  --bg: #f8fafc;
  --text: #3d3d3d;
}

.sidebar-menu {
  width: 250px;
  background: var(--primary);
  border-right: none;
  min-height: 100vh;
  padding: 2.5rem 0 2rem 0.5rem;
  box-shadow: 2px 0 16px rgba(26,115,232,0.10);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: sticky;
  top: 0;
  z-index: 10;
  transition: box-shadow 0.25s;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  font-size: 1.7rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 2.2rem;
  letter-spacing: 0.01em;
  padding-left: 0.6rem;
  animation: fadeInLeft 0.7s cubic-bezier(.4,0,.2,1);
}
.logo-icon {
  font-size: 2.1rem;
  margin-right: 0.5rem;
  filter: drop-shadow(0 2px 4px rgba(255,255,255,0.10));
}
.logo-text {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 2px 8px rgba(26,115,232,0.13);
  letter-spacing: 0.03em;
}

.sidebar-menu nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.menu-item {
  margin-bottom: 0.7rem;
}
.menu-btn {
  width: 100%;
  background: rgba(255,255,255,0.06);
  border: none;
  text-align: left;
  font-size: 1.08rem;
  color: #fff;
  padding: 0.7rem 1.2rem;
  border-radius: 6px;
  transition: background 0.23s, color 0.23s, box-shadow 0.22s;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  box-shadow: none;
  opacity: 0;
  transform: translateY(18px);
  animation: fadeInUp 0.5s cubic-bezier(.4,0,.2,1) forwards;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.menu-btn i {
  font-size: 1rem;
  width: 1.2rem;
  text-align: center;
}

.menu-btn:hover, .menu-btn.active {
  background: #fff;
  color: var(--primary);
  font-weight: 700;
  box-shadow: 0 3px 16px rgba(26,115,232,0.10);
  letter-spacing: 0.01em;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-35px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 900px) {
  .sidebar-menu {
    width: 180px;
    padding-left: 0.2rem;
  }
  .menu-btn {
    font-size: 0.98rem;
    padding: 0.6rem 0.7rem;
  }
}
@media (max-width: 600px) {
  .sidebar-menu {
    display: none;
  }
}
</style>
