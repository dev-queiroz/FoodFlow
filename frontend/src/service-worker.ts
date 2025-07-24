// Tipos globais para Service Worker
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'foodflow-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/src/main.ts',
  '/src/App.vue',
  '/src/views/HomeView.vue',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  const installTask = async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS_TO_CACHE);
    return self.skipWaiting();
  };
  
  event.waitUntil(installTask());
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  const activateTask = async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter((name) => name !== CACHE_NAME)
        .map((name) => caches.delete(name))
    );
    await self.clients.claim();
  };
  
  event.waitUntil(activateTask());
});

// Estratégia de cache: Cache First, fallback para rede
self.addEventListener('fetch', (event) => {
  // Ignora requisições que não são GET ou que são para outras origens
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  const respond = async () => {
    // Para navegação HTML, sempre tenta buscar da rede primeiro
    const isNavigation = event.request.mode === 'navigate';
    
    try {
      // Tenta buscar da rede primeiro para navegação
      if (isNavigation) {
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          // Se falhar, continua para o cache
        }
      }
      
      // Tenta buscar do cache
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) return cachedResponse;
      
      // Se for uma navegação e não tiver no cache, retorna a página de fallback offline
      if (isNavigation) {
        const offlineResponse = await caches.match('/offline.html');
        if (offlineResponse) return offlineResponse;
        
        // Se não encontrar a página de fallback, retorna uma resposta simples
        return new Response(
          '<h1>Você está offline</h1><p>Por favor, verifique sua conexão com a internet.</p>',
          { 
            headers: { 'Content-Type': 'text/html' } 
          }
        );
      }
      
      // Para outros recursos, tenta buscar da rede
      try {
        const networkResponse = await fetch(event.request);
        
        // Se for bem-sucedido, armazena no cache
        if (networkResponse && networkResponse.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
      } catch (error) {
        throw new Error('Network request failed');
      }
    } catch (error) {
      // Se tudo falhar, retorna uma resposta de fallback
      if (isNavigation) {
        const offlineResponse = await caches.match('/offline.html');
        if (offlineResponse) return offlineResponse;
      }
      
      return new Response(
        'Você está offline e este recurso não está disponível no cache.',
        { 
          status: 408,
          statusText: 'Offline',
          headers: { 'Content-Type': 'text/plain' } 
        }
      );
    }
  };
  
  event.respondWith(respond());
});

// Atualização em segundo plano
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-data') {
    console.log('Sincronizando dados em segundo plano...');
    // Aqui você pode adicionar lógica de sincronização
  }
});
