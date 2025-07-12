// Verifica se o navegador suporta service workers
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        
        // Verifica se há uma nova versão do Service Worker disponível
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              // Quando o novo Service Worker estiver instalado
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('Nova versão do aplicativo disponível!');
                // Aqui você pode adicionar lógica para notificar o usuário sobre a atualização
                // Por exemplo, mostrar um botão para atualizar a página
                const updateAvailable = confirm('Uma nova versão do aplicativo está disponível. Deseja atualizar agora?');
                if (updateAvailable) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch(error => {
        console.error('Erro ao registrar o ServiceWorker:', error);
      });
  });

  // Verifica se há uma nova versão do Service Worker quando a página ganha foco
  window.addEventListener('focus', () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.getRegistration()
        .then(registration => {
          if (registration) {
            registration.update().catch(error => {
              console.error('Erro ao verificar atualizações do ServiceWorker:', error);
            });
          }
        });
    }
  });
}
