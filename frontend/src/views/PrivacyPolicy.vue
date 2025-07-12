<template>
  <div class="privacy-container">
    <h1 class="privacy-title">Política de Privacidade</h1>
    <section class="privacy-content">
      <h2>1. Coleta de Informações</h2>
      <p>
        Coletamos informações fornecidas por você no momento do cadastro, como nome, e-mail, telefone e dados do restaurante. Também coletamos dados de uso para melhorar sua experiência.
      </p>
      <h2>2. Uso das Informações</h2>
      <p>
        Utilizamos seus dados para oferecer nossos serviços, personalizar sua experiência, enviar comunicações importantes e aprimorar a plataforma.
      </p>
      <h2>3. Compartilhamento de Dados</h2>
      <p>
        Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para cumprir obrigações legais ou mediante seu consentimento.
      </p>
      <h2>4. Segurança</h2>
      <p>
        Adotamos medidas de segurança para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição.
      </p>
      <h2>5. Seus Direitos</h2>
      <p>
        Você pode acessar, corrigir ou excluir seus dados a qualquer momento. Basta entrar em contato pelo e-mail suporte@restaurasys.com.br.
      </p>
      <h2>6. Alterações nesta Política</h2>
      <p>
        Podemos atualizar esta Política de Privacidade periodicamente. Notificações sobre alterações serão feitas pela plataforma.
      </p>
    </section>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PrivacyPolicy'
}
</script>

<style scoped>
.privacy-container {
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 16px rgba(102, 126, 234, 0.07);
}
.privacy-title {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 1.5rem;
  text-align: center;
}
.privacy-content h2 {
  font-size: 1.15rem;
  font-weight: 600;
  color: #764ba2;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}
.privacy-content p {
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.7;
}
@media (max-width: 600px) {
  .privacy-container {
    padding: 1rem;
  }
  .privacy-title {
    font-size: 1.4rem;
  }
}
</style>
