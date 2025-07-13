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
        
        <div v-if="!emailSent" class="header-content">
          <h1 class="auth-title">Esqueceu sua senha?</h1>
          <p class="auth-subtitle">
            Não se preocupe! Digite seu e-mail e enviaremos um link para redefinir sua senha.
          </p>
        </div>
        
        <div v-else class="header-content success">
          <div class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h1 class="auth-title">E-mail enviado!</h1>
          <p class="auth-subtitle">
            Enviamos um link para redefinir sua senha para <strong>{{ form.email }}</strong>
          </p>
        </div>
      </div>

      <!-- Formulário ou Mensagem de Sucesso -->
      <div class="auth-form-container">
        <div v-if="!emailSent">
          <form @submit.prevent="handleForgotPassword" class="auth-form">
            <div class="form-group">
              <label for="email" class="form-label">E-mail</label>
              <div class="input-container">
                <i class="fas fa-envelope input-icon"></i>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="form-input"
                  placeholder="Digite seu e-mail"
                  :class="{ 'error': errors.email }"
                  required
                >
              </div>
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <button
              type="submit"
              class="submit-btn"
              :disabled="isLoading"
            >
              <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
              <span v-else>Enviar link de recuperação</span>
            </button>
          </form>
        </div>

        <div v-else class="success-content">
          <div class="success-actions">
            <p class="instructions">
              Verifique sua caixa de entrada e clique no link para redefinir sua senha. 
              O link expira em 1 hora.
            </p>
            
            <div class="action-buttons">
              <button @click="resendEmail" class="resend-btn" :disabled="isResending">
                <i v-if="isResending" class="fas fa-spinner fa-spin"></i>
                <span v-else>Reenviar e-mail</span>
              </button>
              
              <router-link to="/auth/login" class="back-btn">
                Voltar ao login
              </router-link>
            </div>
          </div>
        </div>

        <!-- Link para voltar ao login -->
        <div v-if="!emailSent" class="auth-footer">
          <p>
            Lembrou sua senha?
            <router-link to="/auth/login" class="login-link">
              Fazer login
            </router-link>
          </p>
        </div>
      </div>
    </div>

    <!-- Lado direito com dicas de segurança -->
    <div class="auth-illustration">
      <div class="illustration-content">
        <div class="illustration-image">
          <i class="fas fa-shield-alt"></i>
        </div>
        <h2>Segurança em primeiro lugar</h2>
        <p>Suas informações estão protegidas com criptografia de nível bancário.</p>
        
        <!-- Dicas de segurança -->
        <div class="security-tips">
          <div class="tip-item">
            <div class="tip-icon">
              <i class="fas fa-key"></i>
            </div>
            <div>
              <h4>Senhas seguras</h4>
              <p>Use senhas únicas e complexas</p>
            </div>
          </div>
          
          <div class="tip-item">
            <div class="tip-icon">
              <i class="fas fa-mobile-alt"></i>
            </div>
            <div>
              <h4>Verificação em duas etapas</h4>
              <p>Proteção extra para sua conta</p>
            </div>
          </div>
          
          <div class="tip-item">
            <div class="tip-icon">
              <i class="fas fa-clock"></i>
            </div>
            <div>
              <h4>Link temporário</h4>
              <p>Links de recuperação expiram em 1 hora</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';



export default defineComponent({
  name: 'ForgotPasswordView',
  setup() {



    const isLoading = ref(false);
    const isResending = ref(false);
    const emailSent = ref(false);

    const form = reactive({
      email: ''
    });

    const errors = reactive({
      email: ''
    });

    const validateForm = () => {
      errors.email = '';

      if (!form.email) {
        errors.email = 'E-mail é obrigatório';
        return false;
      }

      if (!/\S+@\S+\.\S+/.test(form.email)) {
        errors.email = 'E-mail inválido';
        return false;
      }

      return true;
    };

    const handleForgotPassword = async () => {
      if (!validateForm()) return;

      isLoading.value = true;

      try {
        // Simular envio de e-mail - substituir por chamada real à API
        await new Promise(resolve => setTimeout(resolve, 2000));

        emailSent.value = true;
        // Notificação removida ('E-mail de recuperação enviado!', 'success');
      } catch (error) {
        // Notificação removida ('Erro ao enviar e-mail. Tente novamente.', 'error');
      } finally {
        isLoading.value = false;
      }
    };

    const resendEmail = async () => {
      isResending.value = true;

      try {
        // Simular reenvio de e-mail
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Notificação removida ('E-mail reenviado com sucesso!', 'success');
      } catch (error) {
        // Notificação removida ('Erro ao reenviar e-mail. Tente novamente.', 'error');
      } finally {
        isResending.value = false;
      }
    };

    return {
      form,
      errors,
      isLoading,
      isResending,
      emailSent,
      handleForgotPassword,
      resendEmail
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
  margin-bottom: 2rem;
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

.header-content {
  transition: all 0.3s ease;
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

.success-icon i {
  font-size: 2.5rem;
  color: white;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(72, 187, 120, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(72, 187, 120, 0);
  }
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
  line-height: 1.5;
}

.auth-subtitle strong {
  color: #4a5568;
  font-weight: 600;
}

.auth-form-container {
  width: 100%;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  transition: all 0.2s;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error {
  border-color: #e53e3e;
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
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
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

.success-content {
  text-align: center;
}

.instructions {
  color: #718096;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.resend-btn {
  padding: 0.875rem;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.resend-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(72, 187, 120, 0.3);
}

.resend-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.back-btn {
  display: inline-block;
  padding: 0.875rem;
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #667eea;
  color: white;
  transform: translateY(-1px);
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

/* Lado direito - Dicas de segurança */
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

.security-tips {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: left;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.tip-icon {
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

.tip-icon i {
  font-size: 1.125rem;
  color: white;
}

.tip-item h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.tip-item p {
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

  .security-tips {
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

  .submit-btn,
  .resend-btn,
  .back-btn {
    padding: 0.75rem;
  }
}
</style>
