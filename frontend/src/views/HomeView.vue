<template>
  <div class="home-view">
    <!-- Cabeçalho -->
    <MainHeader />
    <!-- Conteúdo Principal -->
    <main class="main-content">
      <!-- Seção Hero -->
      <section class="hero-section" id="inicio">
      <div class="hero-content">
        <h1 class="fade-in">Sua gestão de restaurante simplificada</h1>
        <p class="hero-subtitle slide-up delay-1">A solução completa para gerenciar seu restaurante de forma eficiente e aumentar suas vendas</p>
        <div class="hero-buttons slide-up delay-2">
          <button @click="startTrial" class="btn btn-primary">Comece Agora</button>
          <button @click="scheduleDemo" class="btn btn-outline">Agendar Demonstração</button>
          <router-link to="/auth/login" class="btn btn-secondary">Entrar</router-link>
        </div>
      </div>
      <div class="hero-image">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80" 
          alt="Restaurante moderno com clientes felizes" 
          loading="lazy"
          width="1920"
          height="1080"
          class="hero-bg"
        >
        <div class="overlay"></div>
      </div>
    </section>

    <!-- Seção de Recursos -->
    <section class="features-section" id="recursos">
      <div class="container">
        <h2 class="section-title">Tudo o que seu restaurante precisa</h2>
        <p class="section-subtitle">Uma plataforma completa para gerenciar todas as áreas do seu negócio</p>
        
        <div class="features-grid">
          <div class="feature-card fade-in">
            <div class="feature-icon">
              <i class="fas fa-utensils"></i>
            </div>
            <h3>Cardápio Digital</h3>
            <p>Ofereça uma experiência moderna aos seus clientes com cardápios digitais interativos e atualizados em tempo real.</p>
          </div>
          
          <div class="feature-card fade-in delay-1">
            <div class="feature-icon">
              <i class="fas fa-cash-register"></i>
            </div>
            <h3>PDV Inteligente</h3>
            <p>Sistema de ponto de venda rápido, intuitivo e integrado com todas as funcionalidades do seu restaurante.</p>
          </div>
          
          <div class="feature-card fade-in delay-2">
            <div class="feature-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <h3>Relatórios Avançados</h3>
            <p>Tenha insights valiosos sobre o desempenho do seu negócio com relatórios detalhados e personalizáveis.</p>
          </div>
          
          <div class="feature-card fade-in delay-3">
            <div class="feature-icon">
              <i class="fas fa-truck"></i>
            </div>
            <h3>Delivery Integrado</h3>
            <p>Gerencie pedidos de delivery de múltiplos canais em um único lugar, incluindo iFood e WhatsApp.</p>
          </div>
          
          <div class="feature-card fade-in delay-4">
            <div class="feature-icon">
              <i class="fas fa-users"></i>
            </div>
            <h3>Gestão de Clientes</h3>
            <p>Cadastro de clientes, histórico de pedidos e programa de fidelidade integrado.</p>
          </div>
          
          <div class="feature-card fade-in delay-5">
            <div class="feature-icon">
              <i class="fas fa-boxes"></i>
            </div>
            <h3>Controle de Estoque</h3>
            <p>Controle automático de estoque com alertas de reposição e gestão de fornecedores.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Seção de Planos -->
    <section class="pricing-section" id="planos">
      <div class="container">
        <h2 class="section-title">Planos que cabem no seu negócio</h2>
        <p class="section-subtitle">Escolha o plano ideal para o seu restaurante</p>
        
        <div class="pricing-grid">
          <div class="pricing-card fade-in">
            <div class="pricing-header">
              <h3>Básico</h3>
              <div class="price">
                <span class="amount">R$ 199</span>
                <span class="period">/mês</span>
              </div>
              <p>Ideal para pequenos restaurantes</p>
            </div>
            <div class="pricing-features">
              <ul>
                <li><i class="fas fa-check"></i> Até 2 PDVs</li>
                <li><i class="fas fa-check"></i> Cardápio Digital</li>
                <li><i class="fas fa-check"></i> Relatórios Básicos</li>
                <li><i class="fas fa-check"></i> Suporte por E-mail</li>
              </ul>
            </div>
            <button class="btn btn-outline">Começar Agora</button>
          </div>
          
          <div class="pricing-card featured fade-in delay-1">
            <div class="popular-tag">Mais Popular</div>
            <div class="pricing-header">
              <h3>Profissional</h3>
              <div class="price">
                <span class="amount">R$ 399</span>
                <span class="period">/mês</span>
              </div>
              <p>Perfeito para restaurantes em crescimento</p>
            </div>
            <div class="pricing-features">
              <ul>
                <li><i class="fas fa-check"></i> Até 5 PDVs</li>
                <li><i class="fas fa-check"></i> Cardápio Digital</li>
                <li><i class="fas fa-check"></i> Relatórios Avançados</li>
                <li><i class="fas fa-check"></i> Integração com iFood</li>
                <li><i class="fas fa-check"></i> Suporte Prioritário</li>
              </ul>
            </div>
            <button class="btn btn-primary">Começar Agora</button>
          </div>
          
          <div class="pricing-card fade-in delay-2">
            <div class="pricing-header">
              <h3>Enterprise</h3>
              <div class="price">
                <span class="amount">Sob Consulta</span>
              </div>
              <p>Para redes de restaurantes</p>
            </div>
            <div class="pricing-features">
              <ul>
                <li><i class="fas fa-check"></i> PDVs Ilimitados</li>
                <li><i class="fas fa-check"></i> Multi-unidades</li>
                <li><i class="fas fa-check"></i> Relatórios Personalizados</li>
                <li><i class="fas fa-check"></i> Suporte Dedicado</li>
              </ul>
            </div>
            <button class="btn btn-primary">Solicitar Orçamento</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Seção de Depoimentos -->
    <section class="testimonials-section" id="depoimentos">
      <div class="container">
        <h2 class="section-title">Quem já usa recomenda</h2>
        <p class="section-subtitle">Veja o que nossos clientes estão falando</p>
        
        <div class="testimonials-slider">
          <div 
            v-for="(testimonial, index) in testimonials" 
            :key="index"
            class="testimonial-card"
            :class="`fade-in${index > 0 ? ` delay-${index}` : ''}`"
          >
            <img 
              :src="testimonial.avatar" 
              :alt="`Foto de ${testimonial.name}`" 
              class="testimonial-avatar"
              loading="lazy"
              width="80"
              height="80"
            >
            <div class="testimonial-rating">
              <span v-for="star in 5" :key="star" :class="{ 'filled': star <= testimonial.rating }">★</span>
            </div>
            <p class="testimonial-text">{{ testimonial.text }}</p>
            <div class="testimonial-author">
              <img :src="testimonial.avatar" :alt="testimonial.name" class="author-avatar">
              <div class="author-info">
                <h4>{{ testimonial.name }}</h4>
                <span class="author-role">{{ testimonial.role }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Seção de Chamada para Ação -->
    <section class="cta-section" id="contato">
      <div class="container">
        <div class="cta-content">
          <h2>Pronto para transformar o seu restaurante?</h2>
          <p>Experimente grátis por 14 dias. Sem cartão de crédito necessário.</p>
          <div class="cta-buttons">
            <button class="btn btn-primary btn-large">Começar Agora</button>
            <button class="btn btn-outline btn-large">Falar com um Especialista</button>
          </div>
        </div>
      </div>
    </section>
    </main>
    
    <!-- Rodapé -->
    <footer class="main-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-about">
            <h3>FoodFlow</h3>
            <p>Soluções inteligentes para gestão de restaurantes. Simplificando o dia a dia dos negócios de alimentação.</p>
            <div class="social-links">
              <a href="#" class="social-icon" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
              <a href="https://www.instagram.com/foodflow.oficial/" class="social-icon" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
              <a href="#" class="social-icon" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
              <a href="#" class="social-icon" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
            </div>
          </div>
          
          <div class="footer-links">
            <h4>Produto</h4>
            <ul>
              <li><a href="#">Recursos</a></li>
              <li><a href="#">Preços</a></li>
              <li><a href="#">Integrações</a></li>
              <li><a href="#">Atualizações</a></li>
              <li><a href="#">API</a></li>
            </ul>
          </div>
          
          <div class="footer-links">
            <h4>Empresa</h4>
            <ul>
              <li><a href="#">Sobre Nós</a></li>
              <li><a href="#">Carreiras</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Imprensa</a></li>
              <li><a href="#">Parceiros</a></li>
            </ul>
          </div>
          
          <div class="footer-links">
            <h4>Suporte</h4>
            <ul>
              <li><a href="#">Central de Ajuda</a></li>
              <li><a href="#">Tutoriais</a></li>
              <li><a href="#">Webinários</a></li>
              <li><a href="#">Status do Serviço</a></li>
              <li><a href="#">Contato</a></li>
            </ul>
          </div>
          
          <div class="footer-newsletter">
            <h4>Receba nossas atualizações</h4>
            <p>Fique por dentro das novidades e dicas para o seu restaurante.</p>
            <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
              <input type="email" v-model="newsletterEmail" placeholder="Seu melhor e-mail" required>
              <button type="submit" class="btn btn-primary">Assinar</button>
            </form>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} FoodFlow. Todos os direitos reservados.</p>
          <div class="footer-legal">
            <a href="#">Termos de Uso</a>
            <span>|</span>
            <a href="#">Política de Privacidade</a>
            <span>|</span>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MainHeader from '@/components/layout/MainHeader.vue';
import { useRouter } from 'vue-router';


export default defineComponent({
  name: 'HomeView',
  components: {

    MainHeader
  },
  setup() {
    const router = useRouter();
    const currentYear = new Date().getFullYear();
    const newsletterEmail = ref('');
    
    const testimonials = [
      {
        name: 'Carla Mendes',
        role: 'Proprietária - Sabor da Terra',
        text: '"Depois que implementamos o sistema, nossa produtividade aumentou em 40%. A gestão do cardápio digital e a integração com os aplicativos de entrega foram um divisor de águas para o nosso negócio."',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 5
      },
      {
        name: 'Rafael Costa',
        role: 'Gerente - Pizzaria Forno a Lenha',
        text: '"O suporte é incrível e a plataforma é extremamente intuitiva. Em uma semana já tínhamos migrado todo o nosso fluxo para o sistema. A redução de erros nos pedidos foi impressionante!"',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 5
      },
      {
        name: 'Juliana Santos',
        role: 'Diretora - Rede Sabores do Brasil',
        text: '"Como rede de restaurantes, precisávamos de algo que se adaptasse a diferentes unidades. A personalização e o suporte dedicado fizeram toda a diferença para o nosso crescimento."',
        avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
        rating: 4
      }
    ];

    const subscribeNewsletter = () => {
      // Lógica para inscrição na newsletter
      console.log('Inscrito com o e-mail:', newsletterEmail.value);
      newsletterEmail.value = '';
      alert('Obrigado por se inscrever em nossa newsletter!');
    };

    const startTrial = () => {
      // Redireciona para a página de cadastro
      router.push('/auth/register');
    };

    const scheduleDemo = () => {
      // Aqui você pode abrir um modal ou redirecionar para uma página de agendamento
      const whatsappNumber = '5511999999999';
      const message = 'Olá! Gostaria de agendar uma demonstração do FoodFlow.';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    };

    return {
      currentYear,
      newsletterEmail,
      testimonials,
      subscribeNewsletter,
      startTrial,
      scheduleDemo
    };
  }
});
</script>

<style scoped>
/* ====================================
   ESTILOS GLOBAIS DA PÁGINA INICIAL
   ==================================== */

.home-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: var(--transition);
  overflow-x: hidden;
}

.main-content {
  flex: 1;
  padding-top: 5rem; /* Espaço para o header fixo */
}

.container {
  width: 100%;
  padding: 0 1.5rem;
}

section {
  padding: 6rem 0;
  position: relative;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  color: var(--text-primary);
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  border-radius: 3px;
}

.section-subtitle {
  font-size: 1.125rem;
  text-align: center;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

/* Botões */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition);
  border: 2px solid var(--border-color);
  font-size: 1rem;
  white-space: nowrap;
}

.btn-primary {
  background-color: var(--primary);
  color: var(--text-on-primary);
  border-color: var(--primary);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.btn-outline {
  background-color: transparent;
  color: var(--primary);
  border-color: var(--primary);
}

.btn-outline:hover {
  background-color: var(--bg-hover);
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: var(--secondary);
  color: white;
  border-color: var(--secondary);
}

.btn-secondary:hover {
  background-color: #d97706;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
}

/* ====================================
   SEÇÃO HERO
   ==================================== */

.hero-section {
  position: relative;
  padding: 8rem 0 6rem;
  overflow: hidden;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  width: 100vw;
  margin-left: calc(50% - 50vw);
  position: relative;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 0 1.5rem;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  line-height: 1.6;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  z-index: 1;
}

.hero-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.1;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(var(--bg-secondary-rgb), 0.9) 0%,
    rgba(var(--bg-secondary-rgb), 0.7) 100%
  );
  z-index: 1;
}

/* ====================================
   SEÇÃO DE RECURSOS
   ==================================== */

.features-section {
  background-color: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.features-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 10% 20%, rgba(var(--primary-rgb), 0.03) 0%, transparent 20%),
              radial-gradient(circle at 90% 80%, rgba(var(--secondary-rgb), 0.03) 0%, transparent 20%);
  z-index: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  position: relative;
  z-index: 1;
  max-width: 100%;
}

.feature-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 2rem;
  text-align: center;
  transition: var(--transition);
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 6px var(--shadow-light);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px var(--shadow-color);
  border-color: var(--primary-light);
}

.feature-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: var(--text-on-primary);
  border-radius: 50%;
  font-size: 1.75rem;
  transition: var(--transition);
}

.feature-card:hover .feature-icon {
  transform: rotateY(180deg);
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.feature-card p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

/* ====================================
   SEÇÃO DE PLANOS
   ==================================== */

.pricing-section {
  background-color: var(--bg-secondary);
  position: relative;
  overflow: hidden;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;
}

@media (max-width: 1024px) {
  .pricing-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .pricing-grid {
    grid-template-columns: 1fr;
  }
}

.pricing-card {
  flex: 1;
  min-width: 0;
  height: 100%;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: 2.5rem 2rem;
  text-align: center;
  transition: var(--transition);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.pricing-card.popular {
  border: 2px solid var(--primary);
  box-shadow: 0 10px 30px -10px rgba(79, 70, 229, 0.2);
}

.popular-badge {
  position: absolute;
  top: 1rem;
  right: -2.5rem;
  background: var(--primary);
  color: var(--text-on-primary);
  padding: 0.25rem 2.5rem;
  transform: rotate(45deg);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pricing-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.price {
  font-size: 3rem;
  font-weight: 800;
  color: var(--primary);
  margin: 1.5rem 0;
  line-height: 1;
}

.price span {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 2rem 0;
  text-align: left;
}

.pricing-features li {
  padding: 0.5rem 0;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pricing-features li::before {
  content: '✓';
  color: var(--success);
  font-weight: bold;
}

/* ====================================
   SEÇÃO DE DEPOIMENTOS
   ==================================== */

.testimonials-section {
  background-color: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.testimonial-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 2rem;
  transition: var(--transition);
  border: 1px solid var(--border-color);
  position: relative;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px var(--shadow-light);
}

.testimonial-content {
  position: relative;
  z-index: 1;
}

.testimonial-text {
  font-style: italic;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 1.5rem;
  position: relative;
  padding-left: 1.5rem;
}

.testimonial-text::before {
  content: '\201C';
  position: absolute;
  left: -0.5rem;
  top: -1rem;
  font-size: 4rem;
  color: var(--primary-light);
  font-family: Georgia, serif;
  line-height: 1;
  opacity: 0.3;
}

.testimonial-author {
  display: flex;
  align-items: center;
  margin-top: 1.5rem;
}

.testimonial-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary-light);
}

.testimonial-info h4 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.1rem;
}

.testimonial-info p {
  margin: 0.25rem 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.rating {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.star {
  color: var(--warning);
  font-size: 1rem;
}

/* ====================================
   SEÇÃO CTA
   ==================================== */

.cta-section {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: var(--text-on-primary);
  text-align: center;
  position: relative;
  overflow: hidden;
  padding: 6rem 0;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.05;
  z-index: 0;
}

.cta-content {
  position: relative;
  z-index: 1;
  max-width: 700px;
  margin: 0 auto;
}

.cta-section h2 {
  font-size: 2.25rem;
  margin-bottom: 1.5rem;
  color: var(--text-on-primary);
}

.cta-section p {
  font-size: 1.125rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-buttons .btn {
  min-width: 180px;
  font-weight: 600;
  padding: 0.875rem 2rem;
  border-radius: var(--radius-md);
  transition: var(--transition);
}

.cta-buttons .btn-primary {
  background: var(--bg-primary);
  color: var(--primary);
  border: 2px solid var(--text-on-primary);
}

.cta-buttons .btn-primary:hover {
  background: transparent;
  color: var(--text-on-primary);
  transform: translateY(-2px);
}

.cta-buttons .btn-outline {
  background: transparent;
  color: var(--text-on-primary);
  border: 2px solid var(--border-light);
}

.cta-buttons .btn-outline:hover {
  background: var(--bg-hover);
  border-color: white;
  transform: translateY(-2px);
}

/* ====================================
   RODAPÉ
   ==================================== */

.main-footer {
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  padding: 4rem 0 0;
  border-top: 1px solid var(--border-color);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-about h3 {
  color: var(--text-primary);
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.footer-about p {
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-primary);
  color: var(--text-secondary);
  transition: var(--transition);
  font-size: 1rem;
}

.social-links a:hover {
  background: var(--primary);
  color: var(--text-on-primary);
  transform: translateY(-3px);
}

.footer-links h4,
.footer-contact h4,
.footer-newsletter h4 {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  position: relative;
  padding-bottom: 10px;
}

.footer-links h4::after,
.footer-contact h4::after,
.footer-newsletter h4::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
}

.footer-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: var(--text-tertiary);
  text-decoration: none;
  transition: color var(--transition-speed) ease;
  display: inline-block;
  position: relative;
  padding-left: 0;
  transition: var(--transition);
}

.footer-links a::before {
  content: '→';
  position: absolute;
  left: -15px;
  opacity: 0;
  transition: var(--transition);
  color: var(--danger);
}

.footer-links a:hover {
  color: var(--primary);
  padding-left: 15px;
}

.footer-links a:hover::before {
  opacity: 1;
  left: 0;
}

.footer-contact p {
  color: var(--text-tertiary);
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
  line-height: 1.6;
}

.footer-contact i {
  margin-right: 10px;
  color: var(--danger);
  width: 20px;
  text-align: center;
  margin-top: 3px;
}

.newsletter-form {
  display: flex;
  margin-top: 1.5rem;
}

.newsletter-form input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-on-primary);
  border-radius: 4px 0 0 4px;
  font-size: 0.9rem;
  transition: var(--transition);
}

.newsletter-form input:focus {
  outline: none;
  border-color: var(--danger);
  box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.2);
}

.newsletter-form .btn {
  border-radius: 0 4px 4px 0;
  padding: 0 20px;
  white-space: nowrap;
}

.footer-bottom {
  border-top: 1px solid #333;
  padding: 1.5rem 0;
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-tertiary);
}

.footer-legal {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.footer-legal a {
  color: var(--text-tertiary);
  text-decoration: none;
  transition: var(--transition);
}

.footer-legal a:hover {
  color: var(--primary);
}

.footer-legal span {
  opacity: 0.3;
}

/* ====================================
   RESPONSIVIDADE
   ==================================== */

@media (max-width: 1024px) {
  .hero-content h1 {
    font-size: 3rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .pricing-card {
    min-width: 100%;
  }
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.125rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-buttons {
    flex-direction: column;
    gap: 1rem;
  }
  
  .cta-buttons .btn {
    width: 100%;
  }
  
  .newsletter-form {
    flex-direction: column;
  }
  
  .newsletter-button {
    width: 100%;
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    gap: 1rem;
  }
  
  .hero-buttons .btn {
    width: 100%;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .footer-legal {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  .footer-legal span {
    display: none;
  }
}
/* ====================================
   ESTILOS BASE
   ==================================== */

.home-view {
  overflow-x: hidden;
  font-family: 'Poppins', sans-serif;
  color: var(--text-primary);
  line-height: 1.6;
  background-color: var(--bg-primary);
  transition: var(--transition);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.btn {
  display: inline-block;
  padding: 12px 28px;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
  border: none;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  color: var(--text-on-primary);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px var(--shadow-hover);
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--text-on-primary);
  color: var(--text-on-primary);
  margin-left: 15px;
}

.btn-outline:hover {
  background: var(--bg-hover);
  transform: translateY(-3px);
}

/* Seção Hero */
.hero-section {
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  color: var(--text-on-primary);
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 0 40px;
  margin: 0 auto;
  text-align: center;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.hero-content p {
  font-size: 1.3rem;
  margin-bottom: 2.5rem;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
}

.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 2rem;
}

.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  z-index: 1;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--overlay);
}

/* Animações */
.fade-in {
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
}

.fade-in.delay-100 {
  animation-delay: 0.3s;
}

.slide-up {
  animation: slideUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estilos para a seção de destaques */
.featured-section {
  padding: 6rem 0;
  background-color: var(--bg-secondary);
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
  text-align: center;
  position: relative;
  padding-bottom: 15px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.menu-item {
  background: var(--bg-primary);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px var(--shadow-light);
  transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
}

.menu-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px var(--shadow-color);
}

.menu-item-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.price {
  position: absolute;
  top: 15px;
  right: 15px;
  background: var(--primary);
  color: var(--text-on-primary);
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.menu-item-content {
  padding: 1.5rem;
}

.menu-item h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.menu-item p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 1rem;
  min-height: 60px;
}

.rating {
  margin-bottom: 1rem;
  color: var(--warning);
  font-size: 1rem;
}

.rating .filled {
  color: var(--warning);
}

.rating .rating-count {
  color: var(--text-tertiary);
  font-size: 0.85rem;
  margin-left: 8px;
}

.btn-small {
  padding: 8px 20px;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.btn-small .icon {
  font-size: 1.1rem;
  line-height: 1;
}

/* Estilos para a seção de categorias */
.categories-section {
  padding: 6rem 0;
  background-color: var(--bg-primary);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.category-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 2rem 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 5px 15px var(--shadow-light);
  border: 1px solid var(--border-color);
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px var(--shadow-light);
  border-color: var(--danger);
}

.category-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: var(--danger);
  transition: var(--transition);
}

.category-card:hover .category-icon {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: var(--text-on-primary);
  transform: rotateY(180deg);
}

.category-card h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.category-card p {
  color: var(--text-tertiary);
  font-size: 0.9rem;
  margin: 0;
}

/* Estilos para o Rodapé */
.main-footer {
  background-color: var(--bg-secondary);
  color: var(--text-on-primary);
  padding: 5rem 0 0;
  font-size: 0.95rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-about h3 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--text-on-primary);
  position: relative;
  display: inline-block;
}

.footer-about h3::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
}

.footer-about p {
  margin-bottom: 1.5rem;
  line-height: 1.7;
}

.social-links {
  display: flex;
  gap: 12px;
  margin-top: 1.5rem;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-hover);
  color: var(--text-on-primary);
  transition: var(--transition);
  font-size: 1rem;
}

.social-icon:hover {
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  transform: translateY(-3px);
}

.footer-links h4,
.footer-contact h4,
.footer-newsletter h4 {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: var(--text-on-primary);
  position: relative;
  padding-bottom: 10px;
}

.footer-links h4::after,
.footer-contact h4::after,
.footer-newsletter h4::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
}

.footer-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: var(--text-tertiary);
  text-decoration: none;
  transition: color var(--transition-speed) ease;
  display: inline-block;
  position: relative;
  padding-left: 0;
  transition: var(--transition);
}

.footer-links a::before {
  content: '→';
  position: absolute;
  left: -15px;
  opacity: 0;
  transition: var(--transition);
  color: var(--danger);
}

.footer-links a:hover {
  color: var(--text-on-primary);
  padding-left: 15px;
}

.footer-links a:hover::before {
  opacity: 1;
  left: 0;
}

.footer-contact p {
  color: var(--text-tertiary);
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
  line-height: 1.6;
}

.footer-contact i {
  margin-right: 10px;
  color: var(--danger);
  width: 20px;
  text-align: center;
  margin-top: 3px;
}

.newsletter-form {
  display: flex;
  margin-top: 1.5rem;
}

.newsletter-form input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-on-primary);
  border-radius: 4px 0 0 4px;
  font-size: 0.9rem;
  transition: var(--transition);
}

.newsletter-form input:focus {
  outline: none;
  border-color: var(--danger);
  box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.2);
}

.newsletter-form .btn {
  border-radius: 0 4px 4px 0;
  padding: 0 20px;
  white-space: nowrap;
}

.footer-bottom {
  border-top: 1px solid #333;
  padding: 1.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-bottom p {
  color: var(--text-tertiary);
  margin: 0;
  font-size: 0.9rem;
}

.payment-methods {
  display: flex;
  gap: 15px;
  color: var(--text-tertiary);
  font-size: 1.5rem;
}

.payment-methods i {
  transition: color var(--transition-speed) ease;
}

.payment-methods i:hover {
  color: var(--text-on-primary);
}

/* Estilos para a seção de Depoimentos */
.testimonials-section {
  padding: 6rem 0;
  background-color: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.testimonials-section::before {
  content: '"';
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20rem;
  color: rgba(255, 107, 107, 0.03);
  font-family: Georgia, serif;
  line-height: 1;
  z-index: 0;
  pointer-events: none;
}

.testimonials-slider {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  position: relative;
  z-index: 1;
}

.testimonial-card {
  background: var(--bg-primary);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px var(--shadow-light);
  transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.testimonial-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: linear-gradient(to bottom, var(--primary), var(--secondary));
  transition: width var(--transition-speed) ease;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px var(--shadow-color);
}

.testimonial-card:hover::before {
  width: 8px;
}

.testimonial-rating {
  color: var(--warning);
  font-size: 1.2rem;
  margin-bottom: 1.2rem;
}

.testimonial-rating .filled {
  color: var(--warning);
}

.testimonial-text {
  color: var(--text-secondary);
  font-style: italic;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}

.testimonial-author {
  display: flex;
  align-items: center;
  margin-top: 1.5rem;
}

.testimonial-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 3px solid var(--text-on-primary);
  box-shadow: 0 4px 12px var(--shadow-color);
  background-color: var(--bg-secondary);
}

.author-info h4 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.author-role {
  font-size: 0.85rem;
  color: var(--text-tertiary);
  display: block;
  margin-top: 2px;
}

/* Estilos para a seção Sobre Nós */
.about-section {
  padding: 6rem 0;
  background-color: var(--bg-secondary);
}

.about-content {
  display: flex;
  align-items: center;
  gap: 4rem;
}

.about-text {
  flex: 1;
}

.about-text p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 1.05rem;
  line-height: 1.7;
}

.stats {
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
  flex: 1;
  min-width: 120px;
}

.stat-number {
  display: block;
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--danger);
  margin-bottom: 0.5rem;
  line-height: 1;
}

.stat-item span:last-child {
  font-size: 0.95rem;
  color: var(--text-tertiary);
}

.about-image {
  flex: 1;
  position: relative;
}

.image-wrapper {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 15px 30px var(--shadow-color);
}

.chef-image {
  width: 100%;
  height: auto;
  display: block;
  transition: transform calc(var(--transition-speed) * 1.5) ease;
}

.image-wrapper:hover .chef-image {
  transform: scale(1.03);
}

.experience-badge {
  position: absolute;
  bottom: -20px;
  right: 30px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: var(--text-on-primary);
  padding: 1.2rem 1.5rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 10px 30px var(--shadow-primary);
  z-index: 2;
}

.experience-badge span {
  display: block;
  line-height: 1.2;
}

.experience-badge span:first-child {
  font-size: 1.8rem;
  font-weight: 700;
}

.experience-badge span:last-child {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Responsividade */
@media (max-width: 1024px) {
  .menu-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .about-content {
    flex-direction: column;
    gap: 3rem;
  }
  
  .stats {
    justify-content: center;
  }
  
  .stat-item {
    flex: 0 0 calc(33.333% - 1rem);
  }
  
  .about-image {
    margin-top: 2rem;
  }
  
  .experience-badge {
    right: 50%;
    transform: translateX(50%);
    bottom: -25px;
  }
}

@media (max-width: 1024px) {
  .testimonials-slider {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 992px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .footer-newsletter {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .hero-content p {
    font-size: 1.1rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .btn-outline {
    margin-left: 0;
    margin-top: 10px;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
    padding: 0 20px;
  }
  
  .menu-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  .category-card {
    padding: 1.5rem 1rem;
  }
  
  .stats {
    justify-content: space-between;
    gap: 1rem;
  }
  
  .stat-item {
    flex: 0 0 calc(50% - 0.5rem);
  }
  
  .stat-number {
    font-size: 1.8rem;
  }
  
  .testimonials-slider {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .testimonial-card {
    padding: 1.5rem;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
  }
  
  .footer-newsletter {
    grid-column: auto;
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}
/* Fixes for user-reported issues */
.hero-section {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.features-section {
  overflow-x: hidden;
}
</style>