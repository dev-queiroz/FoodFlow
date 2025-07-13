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
        <h1 class="auth-title">Crie sua conta</h1>
        <p class="auth-subtitle">Comece a gerenciar seu restaurante hoje mesmo</p>
      </div>

      <!-- Formulário de Cadastro -->
      <div class="auth-form-container">
        <form @submit.prevent="handleRegister" class="auth-form">
          <!-- Cadastro com Google -->
          <button
            type="button"
            @click="registerWithGoogle"
            class="google-btn"
            :disabled="isLoading"
          >
            <svg class="google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Cadastrar com Google</span>
          </button>

          <!-- Divisor -->
          <div class="divider">
            <span>ou</span>
          </div>

          <!-- Campos do formulário -->
          <div class="form-row">
            <div class="form-group">
              <label for="firstName" class="form-label">Nome</label>
              <div class="input-container">
                <i class="fas fa-user input-icon"></i>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  class="form-input"
                  placeholder="Seu nome"
                  :class="{ 'error': errors.firstName }"
                  required
                >
              </div>
              <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
            </div>

            <div class="form-group">
              <label for="lastName" class="form-label">Sobrenome</label>
              <div class="input-container">
                <i class="fas fa-user input-icon"></i>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  class="form-input"
                  placeholder="Seu sobrenome"
                  :class="{ 'error': errors.lastName }"
                  required
                >
              </div>
              <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
            </div>
          </div>

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
            <label for="phone" class="form-label">Telefone</label>
            <div class="input-container">
              <i class="fas fa-phone input-icon"></i>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="form-input"
                placeholder="(12) 3456-7890"
                :class="{ 'error': errors.phone }"
              >
            </div>
            <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
          </div>

          <div class="form-group">
            <label for="restaurantName" class="form-label">Nome do Restaurante</label>
            <div class="input-container">
              <i class="fas fa-store input-icon"></i>
              <input
                id="restaurantName"
                v-model="form.restaurantName"
                type="text"
                class="form-input"
                placeholder="Nome do seu restaurante"
                :class="{ 'error': errors.restaurantName }"
                required
              >
            </div>
            <span v-if="errors.restaurantName" class="error-message">{{ errors.restaurantName }}</span>
          </div>

          <div class="form-row">
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

            <div class="form-group">
              <label for="confirmPassword" class="form-label">Confirmar Senha</label>
              <div class="input-container">
                <i class="fas fa-lock input-icon"></i>
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="••••••••"
                  :class="{ 'error': errors.confirmPassword }"
                  required
                >
                <button
                  type="button"
                  @click="toggleConfirmPassword"
                  class="password-toggle"
                >
                  <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
            </div>
          </div>

          <!-- Força da senha -->
          <div v-if="form.password" class="password-strength">
            <div class="strength-label">Força da senha:</div>
            <div class="strength-meter">
              <div 
                class="strength-bar" 
                :class="passwordStrength.level"
                :style="{ width: passwordStrength.width }"
              ></div>
            </div>
            <div class="strength-text" :class="passwordStrength.level">
              {{ passwordStrength.text }}
            </div>
          </div>

          <!-- Termos e condições -->
          <div class="form-group">
            <label class="checkbox-container">
              <input v-model="form.acceptTerms" type="checkbox" class="checkbox" required>
              <span class="checkmark"></span>
              <span class="terms-text">
  Eu aceito os 
  <router-link to="/terms" class="terms-link" target="_blank" rel="noopener noreferrer">Termos de Uso</router-link> 
  e a 
  <router-link to="/privacy" class="terms-link" target="_blank" rel="noopener noreferrer">Política de Privacidade</router-link>
</span>
            </label>
            <span v-if="errors.acceptTerms" class="error-message">{{ errors.acceptTerms }}</span>
          </div>

          <!-- Botão de cadastro -->
          <button
            type="submit"
            class="submit-btn"
            :disabled="isLoading || !form.acceptTerms"
          >
            <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
            <span v-else>Criar conta</span>
          </button>
        </form>

        <!-- Link para login -->
        <div class="auth-footer">
          <p>
            Já tem uma conta?
            <router-link to="/auth/login" class="login-link">
              Fazer login
            </router-link>
          </p>
        </div>
      </div>
    </div>

    <!-- Lado direito com benefícios -->
    <div class="auth-illustration">
      <div class="illustration-content">
        <div class="illustration-image">
          <i class="fas fa-rocket"></i>
        </div>
        <h2>Transforme seu restaurante</h2>
        <p>Junte-se a milhares de restaurantes que já cresceram com nossa plataforma.</p>
        
        <!-- Benefícios -->
        <div class="benefits-list">
          <div class="benefit-item">
            <div class="benefit-icon">
              <i class="fas fa-bolt"></i>
            </div>
            <div>
              <h4>Setup em 5 minutos</h4>
              <p>Configure seu restaurante rapidamente</p>
            </div>
          </div>
          
          <div class="benefit-item">
            <div class="benefit-icon">
              <i class="fas fa-shield-alt"></i>
            </div>
            <div>
              <h4>Dados seguros</h4>
              <p>Segurança de nível bancário</p>
            </div>
          </div>
          
          <div class="benefit-item">
            <div class="benefit-icon">
              <i class="fas fa-headset"></i>
            </div>
            <div>
              <h4>Suporte 24/7</h4>
              <p>Estamos aqui para ajudar sempre</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';


export default defineComponent({
  name: 'RegisterView',
  setup() {
    const router = useRouter();


    const isLoading = ref(false);
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);

    const form = reactive({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      restaurantName: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    });

    const errors = reactive({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      restaurantName: '',
      password: '',
      confirmPassword: '',
      acceptTerms: ''
    });

    const passwordStrength = computed(() => {
      const password = form.password;
      let score = 0;

      if (password.length >= 8) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[a-z]/.test(password)) score++;
      if (/[0-9]/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;

      const levels = [
        { level: 'weak', text: 'Fraca', width: '20%' },
        { level: 'fair', text: 'Regular', width: '40%' },
        { level: 'good', text: 'Boa', width: '60%' },
        { level: 'strong', text: 'Forte', width: '80%' },
        { level: 'very-strong', text: 'Muito Forte', width: '100%' }
      ];

      return levels[Math.min(score, 4)];
    });

    const validateForm = () => {
      // Reset errors
      Object.keys(errors).forEach(key => {
        errors[key as keyof typeof errors] = '';
      });

      let isValid = true;

      if (!form.firstName.trim()) {
        errors.firstName = 'Nome é obrigatório';
        isValid = false;
      }

      if (!form.lastName.trim()) {
        errors.lastName = 'Sobrenome é obrigatório';
        isValid = false;
      }

      if (!form.email) {
        errors.email = 'E-mail é obrigatório';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        errors.email = 'E-mail inválido';
        isValid = false;
      }

      if (form.phone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(form.phone)) {
        errors.phone = 'Formato de telefone inválido';
        isValid = false;
      }

      if (!form.restaurantName.trim()) {
        errors.restaurantName = 'Nome do restaurante é obrigatório';
        isValid = false;
      }

      if (!form.password) {
        errors.password = 'Senha é obrigatória';
        isValid = false;
      } else if (form.password.length < 8) {
        errors.password = 'Senha deve ter pelo menos 8 caracteres';
        isValid = false;
      }

      if (!form.confirmPassword) {
        errors.confirmPassword = 'Confirmação de senha é obrigatória';
        isValid = false;
      } else if (form.password !== form.confirmPassword) {
        errors.confirmPassword = 'Senhas não coincidem';
        isValid = false;
      }

      if (!form.acceptTerms) {
        errors.acceptTerms = 'Você deve aceitar os termos de uso';
        isValid = false;
      }

      return isValid;
    };

    const handleRegister = async () => {
      if (!validateForm()) return;

      isLoading.value = true;

      try {
        // Simular registro - substituir por chamada real à API
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Notificação removida ('Conta criada com sucesso! Bem-vindo ao RestaurantPro!', 'success');
        
        // Salvar dados de autenticação (substituir por implementação real)
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userName', `${form.firstName} ${form.lastName}`);
        localStorage.setItem('restaurantName', form.restaurantName);

        // Redirecionar para o dashboard
        router.push('/admin');
      } catch (error) {
        // Notificação removida ('Erro ao criar conta. Tente novamente.', 'error');
      } finally {
        isLoading.value = false;
      }
    };

    const registerWithGoogle = async () => {
      isLoading.value = true;
      
      try {
        // Simular registro com Google - aqui você implementaria a integração real
        // Notificação removida ('Conectando com Google...', 'info');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Notificação removida ('Conta criada com Google com sucesso!', 'success');
        
        // Simular dados do usuário do Google
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userName', 'Usuário Google');
        localStorage.setItem('loginMethod', 'google');

        router.push('/admin');
      } catch (error) {
        // Notificação removida ('Erro ao criar conta com Google. Tente novamente.', 'error');
      } finally {
        isLoading.value = false;
      }
    };

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    const toggleConfirmPassword = () => {
      showConfirmPassword.value = !showConfirmPassword.value;
    };

    // Formatação do telefone
    const formatPhone = (value: string) => {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 11) {
        return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
      }
      return value;
    };

    // Watch para formatar telefone

    const handlePhoneInput = () => {
      form.phone = formatPhone(form.phone);
    };

    return {
      form,
      errors,
      isLoading,
      showPassword,
      showConfirmPassword,
      passwordStrength,
      handleRegister,
      registerWithGoogle,
      togglePassword,
      toggleConfirmPassword,
      handlePhoneInput
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
  max-width: 520px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
  overflow-y: auto;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.password-strength {
  margin-top: -0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.strength-label {
  font-size: 0.75rem;
  color: #718096;
}

.strength-meter {
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.strength-bar {
  height: 100%;
  transition: all 0.3s;
  border-radius: 2px;
}

.strength-bar.weak { background: #e53e3e; }
.strength-bar.fair { background: #ff8c00; }
.strength-bar.good { background: #ffd700; }
.strength-bar.strong { background: #9acd32; }
.strength-bar.very-strong { background: #32cd32; }

.strength-text {
  font-size: 0.75rem;
  font-weight: 500;
}

.strength-text.weak { color: #e53e3e; }
.strength-text.fair { color: #ff8c00; }
.strength-text.good { color: #ffd700; }
.strength-text.strong { color: #9acd32; }
.strength-text.very-strong { color: #32cd32; }

.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #4a5568;
  line-height: 1.4;
}

.checkbox {
  width: 1rem;
  height: 1rem;
  margin: 0;
  margin-top: 0.125rem;
}

.terms-text {
  flex: 1;
}

.terms-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
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

.submit-btn:hover:not(:disabled) {
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

.login-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.login-link:hover {
  text-decoration: underline;
}

/* Lado direito - Benefícios */
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

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: left;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.benefit-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  flex-shrink: 0;
}

.benefit-icon i {
  font-size: 1.125rem;
  color: white;
}

.benefit-item h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.benefit-item p {
  font-size: 0.875rem;
  opacity: 0.8;
  margin: 0;
}

/* Responsividade */
@media (max-width: 768px) {
  .auth-container {
    flex-direction: column;
  }

  .auth-illustration {
    order: -1;
    flex: none;
    min-height: 250px;
    padding: 1.5rem;
  }

  .illustration-content h2 {
    font-size: 1.5rem;
  }

  .illustration-content p {
    font-size: 1rem;
  }

  .benefits-list {
    display: none;
  }

  .auth-content {
    max-width: 100%;
    padding: 1.5rem;
  }

  .auth-title {
    font-size: 1.75rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1.5rem;
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
