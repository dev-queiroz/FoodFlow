<template>
  <div class="dashboard-layout">
    <SidebarMenu />
    <div class="dashboard-content">
      <h1>Personalização</h1>
      
      <div class="customization-sections">
        <!-- Seção de Cores -->
        <div class="customization-section">
          <h2>Cores do Sistema</h2>
          <div class="color-options">
            <div 
              v-for="color in colors" 
              :key="color.name"
              class="color-option"
              :style="{ backgroundColor: color.value }"
            >
              <span>{{ color.name }}</span>
            </div>
          </div>
        </div>
        
        <!-- Seção de Logo -->
        <div class="customization-section">
          <h2>Logo do Estabelecimento</h2>
          <div class="logo-preview">
            <div class="logo-placeholder">
              <span>Seu Logo Aqui</span>
            </div>
            <button class="upload-button">
              Alterar Logo
            </button>
          </div>
        </div>
        
        <!-- Seção de Menu Digital -->
        <div class="customization-section">
          <h2>Estilo do Menu Digital</h2>
          <div class="menu-styles">
            <div 
              v-for="style in menuStyles" 
              :key="style"
              class="menu-style-option"
            >
              <div class="style-preview" :class="style"></div>
              <span>{{ style }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SidebarMenu from '@/components/dashboard/SidebarMenu.vue';

export default defineComponent({
  name: 'PersonalizacaoView',
  components: {
    SidebarMenu
  },
  data() {
    return {
      colors: [
        { name: 'Primária', value: '#4f46e5' },
        { name: 'Secundária', value: '#10b981' },
        { name: 'Fundo', value: '#f8fafc' },
        { name: 'Texto', value: '#1e293b' }
      ],
      menuStyles: ['moderno', 'classico', 'minimalista', 'colorido']
    };
  }
});
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

.dashboard-content {
  flex: 1;
  padding: 2.5rem 2rem;
}

.customization-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.customization-section {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.color-options {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.color-option {
  width: 100px;
  height: 100px;
  border-radius: 0.5rem;
  display: flex;
  align-items: flex-end;
  padding: 0.5rem;
  color: white;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.logo-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.logo-placeholder {
  width: 200px;
  height: 100px;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  border-radius: 0.5rem;
}

.upload-button {
  padding: 0.5rem 1rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.menu-styles {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.menu-style-option {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.style-preview {
  height: 100px;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.style-preview.moderno {
  background: linear-gradient(135deg, #4f46e5, #8b5cf6);
}

.style-preview.classico {
  background: linear-gradient(135deg, #d1d5db, #9ca3af);
}

.style-preview.minimalista {
  background: white;
  border: 1px solid #e2e8f0;
}

.style-preview.colorido {
  background: linear-gradient(135deg, #ec4899, #f43f5e, #f59e0b);
}
</style>
