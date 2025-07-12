<template>
  <header 
    class="main-header"
    :class="{ 'scrolled': isScrolled }"
  >
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <router-link to="/" class="logo" @click="closeMobileMenu">
          <span class="logo-icon">🍽️</span>
          <span class="logo-text">RestaurantPro</span>
        </router-link>

        <!-- Navegação Desktop -->
        <nav class="desktop-nav">
          <ul>
            <li v-for="(item, index) in navItems" :key="index">
              <a 
                :href="item.path" 
                class="nav-link"
                :class="{ 'active': $route.path === item.path }"
                @click="scrollToSection"
              >
                {{ item.label }}
              </a>
            </li>
          </ul>
        </nav>

        <!-- Controles do Header -->
        <div class="header-controls">
          <!-- Alternador de Tema -->
          <button 
            class="theme-toggle" 
            @click="toggleTheme"
            aria-label="Alternar tema"
          >
            <span class="theme-icon">
              <i v-if="isDark" class="fas fa-sun"></i>
              <i v-else class="fas fa-moon"></i>
            </span>
          </button>

          <!-- Botão de Login -->
          <router-link to="/login" class="btn btn-outline btn-sm">
            Entrar
          </router-link>

          <!-- Botão de Menu Mobile -->
          <button 
            class="mobile-menu-toggle" 
            @click="toggleMobileMenu"
            aria-label="Alternar menu"
            :aria-expanded="isMobileMenuOpen"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Menu Mobile -->
    <transition name="slide-down">
      <div v-if="isMobileMenuOpen" class="mobile-nav">
        <ul>
          <li v-for="(item, index) in navItems" :key="index">
            <a 
              :href="item.path" 
              class="mobile-nav-link"
              :class="{ 'active': $route.path === item.path }"
              @click="scrollToSection"
            >
              {{ item.label }}
            </a>
          </li>
          <li>
            <router-link 
              to="/login" 
              class="mobile-nav-link"
              @click="closeMobileMenu"
            >
              Entrar
            </router-link>
          </li>
        </ul>
      </div>
    </transition>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed } from 'vue';
import { useTheme } from '@/composables/useTheme';

export default defineComponent({
  name: 'MainHeader',
  setup() {
    const { isDark, toggleTheme } = useTheme();
    const isMobileMenuOpen = ref(false);
    const isScrolled = ref(false);

    const navItems = [
      { label: 'Início', path: '#inicio' },
      { label: 'Recursos', path: '#recursos' },
      { label: 'Planos', path: '#planos' },
      { label: 'Depoimentos', path: '#depoimentos' },
      { label: 'Contato', path: '#contato' }
    ];

    const scrollToSection = (event) => {
      if (event.target.hash) {
        event.preventDefault()
        const element = document.querySelector(event.target.hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    };

    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value;
      document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : '';
    };

    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false;
      document.body.style.overflow = '';
    };

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 10;
    };

    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = '';
    });

    return {
      isDark,
      isScrolled,
      isMobileMenuOpen,
      navItems,
      toggleTheme,
      toggleMobileMenu,
      closeMobileMenu,
      scrollToSection
    };
  },
});
</script>

<style scoped>
.main-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 0;
  background-color: var(--bg-primary);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: var(--transition);
}

.main-header.scrolled {
  padding: 0.5rem 0;
  background-color: rgba(var(--bg-primary-rgb), 0.9);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--text-primary);
  transition: var(--transition);
}

.logo:hover {
  transform: translateY(-2px);
}

.logo-icon {
  margin-right: 0.5rem;
  font-size: 1.8rem;
}

/* Navegação Desktop */
.desktop-nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.desktop-nav li {
  margin: 0 0.5rem;
}

.nav-link {
  position: relative;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  transition: var(--transition);
  border-radius: var(--radius-md);
}

.nav-link:hover,
.nav-link.active {
  color: var(--primary);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: var(--primary);
  transition: var(--transition);
  transform: translateX(-50%);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 60%;
}

/* Controles do Header */
.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Botão de Tema */
.theme-toggle {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.theme-toggle:hover {
  background-color: var(--bg-secondary);
  color: var(--primary);
  transform: rotate(30deg);
}

.theme-icon {
  font-size: 1.2rem;
}

/* Botão de Menu Mobile */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 2rem;
  height: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.mobile-menu-toggle span {
  display: block;
  width: 100%;
  height: 2px;
  background-color: var(--text-primary);
  transition: var(--transition);
  transform-origin: center;
}

.mobile-menu-toggle[aria-expanded="true"] span:first-child {
  transform: translateY(0.65rem) rotate(45deg);
}

.mobile-menu-toggle[aria-expanded="true"] span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-toggle[aria-expanded="true"] span:last-child {
  transform: translateY(-0.65rem) rotate(-45deg);
}

/* Menu Mobile */
.mobile-nav {
  position: fixed;
  top: 5rem;
  left: 0;
  right: 0;
  background-color: var(--bg-primary);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  max-height: calc(100vh - 5rem);
  z-index: 999;
}

.mobile-nav ul {
  list-style: none;
  padding: 1rem 0;
  margin: 0;
}

.mobile-nav li {
  border-bottom: 1px solid var(--border-color);
}

.mobile-nav-link {
  display: block;
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: var(--text-primary);
  transition: var(--transition);
}

.mobile-nav-link:hover,
.mobile-nav-link.active {
  background-color: var(--bg-secondary);
  color: var(--primary);
  padding-left: 2rem;
}

/* Animações */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  max-height: 100vh;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Responsividade */
@media (max-width: 1024px) {
  .desktop-nav {
    display: none;
  }
  
  .mobile-menu-toggle {
    display: flex;
  }
  
  .header-controls .btn-outline {
    display: none;
  }
}

@media (max-width: 640px) {
  .logo-text {
    font-size: 1.2rem;
  }
  
  .logo-icon {
    font-size: 1.5rem;
  }
}
</style>
