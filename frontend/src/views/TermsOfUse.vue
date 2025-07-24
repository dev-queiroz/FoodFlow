<template>
  <div class="terms-container">
    <h1 class="terms-title">Termos de Uso</h1>
    <section class="terms-content">
      <h2>1. Aceitação dos Termos</h2>
      <p>
        Ao criar uma conta ou utilizar o sistema FoodFlow, você concorda com estes Termos de Uso. Caso não concorde, por favor, não utilize a plataforma.
      </p>
      <h2>2. Uso da Plataforma</h2>
      <p>
        O sistema é destinado exclusivamente à gestão de restaurantes. É proibido utilizar a plataforma para fins ilícitos ou que violem a legislação vigente.
      </p>
      <h2>3. Privacidade e Dados</h2>
      <p>
        Suas informações pessoais serão tratadas conforme nossa Política de Privacidade. Não compartilhamos dados sensíveis com terceiros sem sua autorização.
      </p>
      <h2>4. Responsabilidades</h2>
      <p>
        O usuário é responsável por manter a confidencialidade de suas credenciais e pelo uso adequado da plataforma.
      </p>
      <h2>5. Alterações nos Termos</h2>
      <p>
        Reservamo-nos o direito de modificar estes Termos a qualquer momento. Mudanças serão comunicadas por meio da plataforma.
      </p>
      <h2>6. Contato</h2>
      <p>
        Em caso de dúvidas, entre em contato pelo e-mail suporte@foodflow.app.
      </p>
    </section>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TermsOfUse'
}
</script>

<style scoped>
.terms-container {
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 16px rgba(102, 126, 234, 0.07);
}
.terms-title {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 1.5rem;
  text-align: center;
}
.terms-content h2 {
  font-size: 1.15rem;
  font-weight: 600;
  color: #764ba2;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}
.terms-content p {
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.7;
}
@media (max-width: 600px) {
  .terms-container {
    padding: 1rem;
  }
  .terms-title {
    font-size: 1.4rem;
  }
}
</style>
