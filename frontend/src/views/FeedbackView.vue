<template>
  <div class="dashboard-layout">
    <SidebarMenu />
    <div class="dashboard-content">
      <h1>Feedback dos Clientes</h1>
      
      <div class="feedback-sections">
        <!-- Seção de Avaliações -->
        <div class="feedback-section">
          <h2>Avaliações Recentes</h2>
          <div class="ratings-list">
            <div 
              v-for="rating in ratings" 
              :key="rating.id"
              class="rating-item"
            >
              <div class="rating-header">
                <span class="customer-name">{{ rating.customer }}</span>
                <div class="stars">
                  <span v-for="n in 5" :key="n">{{ n <= rating.stars ? '★' : '☆' }}</span>
                </div>
              </div>
              <p class="rating-comment">{{ rating.comment }}</p>
              <span class="rating-date">{{ rating.date }}</span>
            </div>
          </div>
        </div>
        
        <!-- Seção de Estatísticas -->
        <div class="feedback-section">
          <h2>Estatísticas de Satisfação</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <h3>Média de Avaliações</h3>
              <div class="stat-value">4.2</div>
              <div class="stat-stars">★★★★☆</div>
            </div>
            
            <div class="stat-card">
              <h3>Total de Avaliações</h3>
              <div class="stat-value">128</div>
            </div>
            
            <div class="stat-card">
              <h3>Recomendação</h3>
              <div class="stat-value">92%</div>
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
  name: 'FeedbackView',
  components: {
    SidebarMenu
  },
  data() {
    return {
      ratings: [
        {
          id: 1,
          customer: 'Ana Silva',
          stars: 5,
          comment: 'Atendimento excelente e comida deliciosa!',
          date: '30/07/2025'
        },
        {
          id: 2,
          customer: 'Carlos Oliveira',
          stars: 4,
          comment: 'Bom ambiente, mas o serviço poderia ser mais rápido.',
          date: '29/07/2025'
        },
        {
          id: 3,
          customer: 'Mariana Santos',
          stars: 5,
          comment: 'Melhor restaurante da região! Voltarei com certeza.',
          date: '28/07/2025'
        }
      ]
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

.feedback-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.feedback-section {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.ratings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.rating-item {
  padding: 1rem;
  border-radius: 0.5rem;
  background: #f8fafc;
}

.rating-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.customer-name {
  font-weight: 600;
}

.stars {
  color: #f59e0b;
}

.rating-comment {
  color: #64748b;
  margin-bottom: 0.5rem;
}

.rating-date {
  font-size: 0.8rem;
  color: #94a3b8;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.stat-card {
  text-align: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 600;
  color: #4f46e5;
  margin: 0.5rem 0;
}

.stat-stars {
  color: #f59e0b;
  font-size: 1.5rem;
}
</style>
