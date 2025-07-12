import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import WaiterPanel from '../views/WaiterPanel.vue';
import KitchenPanel from '../views/KitchenPanel.vue';
import AdminPanel from '../views/AdminPanel.vue';
import MenuView from '../views/client/MenuView.vue';
import KitchenDashboard from '../views/kitchen/KitchenDashboard.vue';
import WaiterDashboard from '../views/waiter/WaiterDashboard.vue';
import NotFound from '../views/NotFound.vue';

// Auth Views
import LoginView from '../views/auth/LoginView.vue';
import RegisterView from '../views/auth/RegisterView.vue';
import TermsOfUse from '@/views/TermsOfUse.vue';
import PrivacyPolicy from '@/views/PrivacyPolicy.vue';
import ForgotPasswordView from '../views/auth/ForgotPasswordView.vue';

const routes: Array<RouteRecordRaw> = [
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
    path: '/garcom',
    name: 'Garcom',
    component: WaiterPanel,
    meta: { requiresAuth: true }
  },
  {
    path: '/cozinha',
    name: 'Cozinha',
    component: KitchenPanel,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPanel,
    meta: { requiresAuth: true }
  },
  {
    path: '/menu',
    name: 'Menu',
    component: MenuView
  },
  {
    path: '/kitchen',
    name: 'Kitchen',
    component: KitchenDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/waiter',
    name: 'Waiter',
    component: WaiterDashboard,
    meta: { requiresAuth: true }
  },
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
  },
  // 404 route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redireciona para login se a rota requer autenticação e o usuário não está logado
    next('/auth/login');
  } else if ((to.path === '/auth/login' || to.path === '/auth/register') && isAuthenticated) {
    // Redireciona para dashboard se o usuário já está logado e tenta acessar páginas de auth
    const userRole = localStorage.getItem('userRole');
    switch (userRole) {
      case 'admin':
        next('/admin');
        break;
      case 'waiter':
        next('/waiter');
        break;
      case 'kitchen':
        next('/kitchen');
        break;
      default:
        next('/admin');
    }
  } else {
    // Adicionar log para depuração
    console.log('Navegando para:', to.path);
    next();
  }
});

export default router;