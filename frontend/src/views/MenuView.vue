<template>
  <div class="menu-view">
    <MainHeader />
    
    <main class="main-content">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container">
          <h1>Nosso Cardápio Digital</h1>
          <p class="subtitle">Explore nossos pratos e bebidas</p>
        </div>
      </section>

      <!-- Menu Categories -->
      <section class="categories-section">
        <div class="container">
          <div class="categories-grid">
            <div 
              v-for="category in categories" 
              :key="category.id"
              class="category-card"
            >
              <img :src="category.image" :alt="category.name">
              <h3>{{ category.name }}</h3>
            </div>
          </div>
        </div>
      </section>

      <!-- Menu Items Grid -->
      <section class="menu-items-section">
        <div class="container">
          <h2 class="section-title">Pratos Principais</h2>
          <div class="menu-grid">
            <div 
              v-for="item in menuItems" 
              :key="item.id"
              class="menu-card"
            >
              <img :src="item.image" :alt="item.name">
              <div class="menu-card-content">
                <h3>{{ item.name }}</h3>
                <p class="description">{{ item.description }}</p>
                <p class="price">{{ item.price }}</p>
                <button class="btn btn-primary">Adicionar</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <MainFooter />
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: [
        { id: 1, name: 'Entradas', image: 'https://images.unsplash.com/photo-1544025162-d76694265947' },
        { id: 2, name: 'Pratos Principais', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' },
        { id: 3, name: 'Sobremesas', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb' },
        { id: 4, name: 'Bebidas', image: 'https://images.unsplash.com/photo-1436076863939-06870fe779c2' }
      ],
      menuItems: [
        {
          id: 1,
          name: 'Filé Mignon',
          description: 'Com batatas rústicas e legumes grelhados',
          price: 'R$ 89,90',
          image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976'
        },
        {
          id: 2,
          name: 'Risoto de Cogumelos',
          description: 'Arroz arbóreo com mix de cogumelos frescos',
          price: 'R$ 59,90',
          image: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d'
        },
        {
          id: 3,
          name: 'Salada Caesar',
          description: 'Alface romana, croutons, parmesão e molho especial',
          price: 'R$ 39,90',
          image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1'
        }
      ]
    }
  }
}
</script>

<style scoped>
/* Reuse styles from HomeView with menu-specific adjustments */
.menu-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.hero-section {
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), 
              url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0') center/cover;
  color: white;
  padding: 8rem 0;
  text-align: center;
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.category-card {
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: var(--transition);
  cursor: pointer;
  text-align: center;
}

.category-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.category-card h3 {
  margin-top: 1rem;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.menu-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

.menu-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.menu-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.menu-card-content {
  padding: 1.5rem;
}

.menu-card h3 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.price {
  font-weight: bold;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--primary);
}
</style>
