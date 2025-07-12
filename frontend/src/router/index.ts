import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import WaiterPanel from '../views/WaiterPanel.vue';
import KitchenPanel from '../views/KitchenPanel.vue';
import AdminPanel from '../views/AdminPanel.vue';
import MenuView from '../views/client/MenuView.vue';
import KitchenDashboard from '../views/kitchen/KitchenDashboard.vue';
import WaiterDashboard from '../views/waiter/WaiterDashboard.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/garcom',
    name: 'Garcom',
    component: WaiterPanel
  },
  {
    path: '/cozinha',
    name: 'Cozinha',
    component: KitchenPanel
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPanel
  },
  {
    path: '/menu',
    name: 'Menu',
    component: MenuView
  },
  {
    path: '/kitchen',
    name: 'Kitchen',
    component: KitchenDashboard
  },
  {
    path: '/waiter',
    name: 'Waiter',
    component: WaiterDashboard
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
