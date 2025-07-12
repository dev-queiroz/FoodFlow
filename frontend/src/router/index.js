import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MenuView from '../views/MenuView.vue'
import CozinhaView from '../views/CozinhaView.vue'
import GarcomView from '../views/GarcomView.vue'
import AdminView from '../views/AdminView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/cardapio',
    name: 'menu',
    component: MenuView
  },
  {
    path: '/cozinha',
    name: 'cozinha',
    component: CozinhaView
  },
  {
    path: '/garcom',
    name: 'garcom',
    component: GarcomView
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
