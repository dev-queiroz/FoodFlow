<template>
  <div class="auth-container">
    <div class="auth-background"></div>
    
    <div class="auth-content">
      <!-- Logo e Título -->
      <div class="auth-header">
        <router-link to="/" class="logo-link">
          <div class="logo">
            <i class="fas fa-utensils logo-icon"></i>
            <span>RestaurantPro</span>
          </div>
        </router-link>
        <h1 class="auth-title">Bem-vindo de volta!</h1>
        <p class="auth-subtitle">Entre na sua conta para gerenciar seu restaurante</p>
      </div>

      <!-- Formulário de Login -->
      <div class="auth-form-container">
        <form @submit.prevent="handleLogin" class="auth-form">
          <!-- Login com Google -->
          <button
            type="button"
            @click="loginWithGoogle"
            class="google-btn"
            :disabled="isLoading"
          >
            <svg class="google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continuar com Google</span>
          </button>

          <!-- Divisor -->
          <div class="divider">
            <span>ou</span>
          </div>

          <!-- Campos do formulário -->
          <div class="form-group">
            <label for="email" class="form-label">E-mail</label>
            <div class="input-container">
              <i class="fas fa-envelope input-icon"></i>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-input"
                placeholder="seu@email.com"
                :class="{ 'error': errors.email }"
                required
              >
            </div>
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Senha</label>
            <div class="input-container">
              <i class="fas fa-lock input-icon"></i>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="••••••••"
                :class="{ 'error': errors.password }"
                required
              >
              <button
                type="button"
                @click="togglePassword"
                class="password-toggle"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <!-- Opções adicionais -->
          <div class="form-options">
            <label class="checkbox-container">
              <input v-model="form.rememberMe" type="checkbox" class="checkbox">
              <span class="checkmark"></span>
              Lembrar de mim
            </label>
            <router-link to="/auth/forgot-password" class="forgot-link">
              Esqueceu a senha?
            </router-link>
          </div>

          <!-- Botão de login -->
          <button
            type="submit"
            class="submit-btn"
            :disabled="isLoading"
          >
            <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
            <span v-else>Entrar</span>
          </button>
        </form>

        <!-- Link para cadastro -->
        <div class="auth-footer">
          <p>
            Não tem uma conta?
            <router-link to="/auth/register" class="register-link">
              Criar conta
            </router-link>
          </p>
        </div>
      </div>
    </div>

    <!-- Lado direito com imagem/ilustração -->
    <div class="auth-illustration">
      <div class="illustration-content">
        <div class="illustration-image">
          <i class="fas fa-chart-line"></i>
        </div>
        <h2>Gerencie seu restaurante com facilidade</h2>
        <p>Controle pedidos, estoque, relatórios e muito mais em uma única plataforma.</p>
        
        <!-- Demo Login Info -->
        <div class="demo-info">
          <h3>🎯 Teste Agora!</h3>
          <p>Clique em uma das opções abaixo para preencher automaticamente:</p>
          <div class="demo-accounts">
            <div class="demo-account" @click="fillDemoCredentials('admin')">
              <strong>👨‍💼 Administrador:</strong>
              <div class="credentials">
                <code>admin@restaurante.com</code>
                <code>123456</code>
              </div>
            </div>
            <div class="demo-account" @click="fillDemoCredentials('kitchen')">
              <strong>👨‍🍳 Cozinha:</strong>
              <div class="credentials">
                <code>cozinha@restaurante.com</code>
                <code>123456</code>
              </div>
            </div>
            <div class="demo-account" @click="fillDemoCredentials('waiter')">
              <strong>🍽️ Garçom:</strong>
              <div class="credentials">
                <code>garcom@restaurante.com</code>
                <code>123456</code>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Features destacadas -->
        <div class="features-list">
          <div class="feature-item">
            <i class="fas fa-check-circle"></i>
            <span>Gestão de pedidos em tempo real</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-check-circle"></i>
            <span>Relatórios avançados</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-check-circle"></i>
            <span>Integração com delivery</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useNotification } from '@/composables/useNotification';

export default defineComponent({
  name: 'LoginView',
  setup() {
    const router = useRouter();
    const { showNotification } = useNotification();

    const isLoading = ref(false);
    const showPassword = ref(false);

    const form = reactive({
      email: '',
      password: '',
      rememberMe: false
    });

    const errors = reactive({
      email: '',
      password: ''
    });

    const validateForm = () => {
      errors.email = '';
      errors.password = '';

      if (!form.email) {
        errors.email = 'E-mail é obrigatório';
        return false;
      }

      if (!/\S+@\S+\.\S+/.test(form.email)) {
        errors.email = 'E-mail inválido';
        return false;
      }

      if (!form.password) {
        errors.password = 'Senha é obrigatória';
        return false;
      }

      if (form.password.length < 6) {
        errors.password = 'Senha deve ter pelo menos 6 caracteres';
        return false;
      }

      return true;
    };

    const handleLogin = async () => {
      if (!validateForm()) return;

      isLoading.value = true;

      try {
        // Simular autenticação - substituir por chamada real à API
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simular sucesso/erro baseado no email
        if (form.email === 'admin@restaurante.com' && form.password === '123456') {
          showNotification('Login realizado com sucesso!', 'success');
          
          // Salvar dados de autenticação (substituir por implementação real)
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', 'admin');
          localStorage.setItem('userName', 'Administrador');

          // Redirecionar baseado no tipo de usuário
          router.push('/admin');
        } else if (form.email === 'garcom@restaurante.com' && form.password === '123456') {
          showNotification('Login realizado com sucesso!', 'success');
          
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', 'waiter');
          localStorage.setItem('userName', 'Garçom');

          router.push('/waiter');
        } else if (form.email === 'cozinha@restaurante.com' && form.password === '123456') {
          showNotification('Login realizado com sucesso!', 'success');
          
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', 'kitchen');
          localStorage.setItem('userName', 'Cozinheiro');

          router.push('/kitchen');
        } else {
          throw new Error('Credenciais inválidas');
        }
      } catch (error) {
        showNotification('E-mail ou senha incorretos', 'error');
      } finally {
        isLoading.value = false;
      }
    };

    const loginWithGoogle = async () => {
      isLoading.value = true;
      
      try {
        // Simular login com Google - aqui você implementaria a integração real
        showNotification('Conectando com Google...', 'info');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        showNotification('Login com Google realizado com sucesso!', 'success');
        
        // Simular dados do usuário do Google
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userName', 'Usuário Google');
        localStorage.setItem('loginMethod', 'google');

        router.push('/admin');
      } catch (error) {
        showNotification('Erro ao fazer login com Google. Tente novamente.', 'error');
      } finally {
        isLoading.value = false;
      }
    };

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    const fillDemoCredentials = (type: 'admin' | 'kitchen' | 'waiter') => {
      const credentials = {
        admin: { email: 'admin@restaurante.com', password: '123456' },
        kitchen: { email: 'cozinha@restaurante.com', password: '123456' },
        waiter: { email: 'garcom@restaurante.com', password: '123456' }
      };
      
      form.email = credentials[type].email;
      form.password = credentials[type].password;
      
      showNotification(`Credenciais de ${type === 'admin' ? 'administrador' : type === 'kitchen' ? 'cozinha' : 'garçom'} preenchidas!`, 'info');
    };

    return {
      form,
      errors,
      isLoading,
      showPassword,
      handleLogin,
      loginWithGoogle,
      togglePassword,
      fillDemoCredentials
    };
  }
});
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: -1;
}

.auth-content {
  flex: 1;
  max-width: 480px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-link {
  display: inline-block;
  text-decoration: none;
  margin-bottom: 1.5rem;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  gap: 0.5rem;
}

.logo-icon {
  font-size: 2rem;
}

.auth-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: #718096;
  font-size: 1rem;
}

.auth-form-container {
  width: 100%;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  background: white;
  color: #4a5568;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.google-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: left 0.5s;
}

.google-btn:hover::before {
  left: 100%;
}

.google-btn:hover {
  border-color: #cbd5e0;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.google-btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.google-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.google-icon {
  width: 20px;
  height: 20px;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 0.5rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.divider span {
  padding: 0 1rem;
  color: #718096;
  font-size: 0.875rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: #4a5568;
  font-size: 0.875rem;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 0.875rem;
  color: #a0aec0;
  z-index: 2;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  position: relative;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.form-input:hover:not(:focus) {
  border-color: #cbd5e0;
}

.form-input.error {
  border-color: #e53e3e;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.password-toggle {
  position: absolute;
  right: 0.875rem;
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  padding: 0.25rem;
  z-index: 2;
}

.password-toggle:hover {
  color: #718096;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: -0.5rem 0;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #4a5568;
}

.checkbox {
  width: 1rem;
  height: 1rem;
  margin: 0;
}

.forgot-link {
  color: #667eea;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
}

.forgot-link:hover {
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.6s;
}

.submit-btn:hover::before {
  left: 100%;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

.submit-btn:active {
  transform: translateY(0);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.auth-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.auth-footer p {
  color: #718096;
  margin: 0;
}

.register-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.register-link:hover {
  text-decoration: underline;
}

/* Lado direito - Ilustração */
.auth-illustration {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
}

.illustration-content {
  text-align: center;
  color: white;
  max-width: 400px;
}

.illustration-image {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.illustration-image i {
  font-size: 3rem;
  color: white;
}

.illustration-content h2 {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.illustration-content p {
  font-size: 1.125rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.demo-info {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.demo-info h3 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: white;
}

.demo-info p {
  font-size: 0.95rem;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.demo-accounts {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.demo-account {
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
}

.demo-account:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.demo-account:active {
  transform: translateY(0);
}

.demo-account strong {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  color: white;
}

.credentials {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.credentials code {
  background: rgba(0, 0, 0, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
}

.feature-item i {
  color: #68d391;
  font-size: 1.25rem;
}

/* Responsividade */
@media (max-width: 768px) {
  .auth-container {
    flex-direction: column;
  }

  .auth-illustration {
    order: -1;
    flex: none;
    min-height: 200px;
    padding: 1.5rem;
  }

  .illustration-content h2 {
    font-size: 1.5rem;
  }

  .illustration-content p {
    font-size: 1rem;
  }

  .features-list {
    display: none;
  }

  .demo-info {
    display: none;
  }

  .auth-content {
    max-width: 100%;
    padding: 1.5rem;
  }

  .auth-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .auth-content {
    padding: 1rem;
  }

  .auth-title {
    font-size: 1.5rem;
  }

  .form-input {
    padding: 0.75rem 1rem 0.75rem 2.25rem;
  }

  .google-btn,
  .submit-btn {
    padding: 0.75rem;
  }
}
</style>
