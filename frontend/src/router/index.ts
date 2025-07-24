import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/auth/LoginView.vue';
import RegisterView from '../views/auth/RegisterView.vue';
import TermsOfUse from '@/views/TermsOfUse.vue';
import PrivacyPolicy from '@/views/PrivacyPolicy.vue';
import ForgotPasswordView from '../views/auth/ForgotPasswordView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue')
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('../views/MenuView.vue')
  },
  {
    path: '/tables',
    name: 'Tables',
    component: () => import('../views/TablesView.vue')
  },
  {
    path: '/waiter',
    name: 'Waiter',
    component: () => import('../views/WaiterView.vue')
  },
  {
    path: '/kitchen',
    name: 'Kitchen',
    component: () => import('../views/KitchenView.vue')
  },
  {
    path: '/waiter',
    name: 'Waiter',
    component: () => import('../views/WaiterView.vue')
  },
  {
    path: '/kitchen',
    name: 'Kitchen',
    component: () => import('../views/kitchen/KitchenDashboard.vue')
  },
  {
    path: '/reservations',
    name: 'Reservations',
    component: () => import('../views/ReservationsView.vue')
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../views/OrdersView.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  // Direct auth routes without nesting (fix for the immediate issue)
  {
    path: '/auth/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresGuest: true }
  },
  {
    path: '/auth/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasswordView
  },
  // Redirect antigo para nova rota
  {
    path: '/login',
    redirect: '/auth/login'
  },
  {
    path: '/register',
    redirect: '/auth/register'
  },
  // Rotas protegidas

  {
    path: '/terms',
    name: 'TermsOfUse',
    component: TermsOfUse,
    meta: { public: true }
  },
  {
    path: '/privacy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicy,
    meta: { public: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// [Wireframe mode] Desabilitado bloqueio de autenticação para facilitar acesso livre aos wireframes
router.beforeEach((_, __, next) => {
  next();
});

export default router;