// Nomes dos caches
const CACHE_NAME = 'foodflow-v1';
const OFFLINE_CACHE = 'foodflow-offline';
const ASSETS_CACHE = 'foodflow-assets';

// Estratégias de cache
const CACHE_STRATEGY = {
  CACHE_FIRST: 'CacheFirst',
  NETWORK_FIRST: 'NetworkFirst',
  STALE_WHILE_REVALIDATE: 'StaleWhileRevalidate',
  NETWORK_ONLY: 'NetworkOnly',
  CACHE_ONLY: 'CacheOnly',
};

// Função para determinar a estratégia de cache
function getCacheStrategy(request) {
  const url = new URL(request.url);
  
  // Cache first para assets estáticos
  if (url.pathname.match(/\.(js|css|woff2?|eot|ttf|otf|png|jpe?g|gif|svg|webp|avif|ico)$/i)) {
    return CACHE_STRATEGY.CACHE_FIRST;
  }
  
  // Network first para requisições de API
  if (url.pathname.startsWith('/api/')) {
    return CACHE_STRATEGY.NETWORK_FIRST;
  }
  
  // Network first para navegação
  if (request.mode === 'navigate') {
    return CACHE_STRATEGY.NETWORK_FIRST;
  }
  
  // Padrão: cache first
  return CACHE_STRATEGY.CACHE_FIRST;
}

// Estratégia: Cache First
async function handleCacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    return new Response('Você está offline e este recurso não está disponível no cache.', {
      status: 503,
      statusText: 'Offline',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Estratégia: Network First
async function handleNetworkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Página offline para navegação
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match('/offline.html');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    return new Response('Você está offline e este recurso não está disponível no cache.', {
      status: 503,
      statusText: 'Offline',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Evento: Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          '/',
          '/offline.html',
          '/assets/icons/pwa-192x192.png',
          '/assets/icons/pwa-512x512.png',
          '/assets/icons/manifest.json'
        ]);
      })
      .then(() => self.skipWaiting())
  );
});

// Evento: Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Evento: Interceptação de requisições
self.addEventListener('fetch', (event) => {
  // Ignora requisições que não sejam GET
  if (event.request.method !== 'GET') {
    return;
  }
  
  const url = new URL(event.request.url);
  
  // Ignora requisições de origens diferentes
  if (!url.origin.startsWith(self.location.origin)) {
    return;
  }
  
  // Ignora requisições do Vite dev server
  if (url.pathname.startsWith('/@vite/') || url.pathname.startsWith('/src/')) {
    return;
  }
  
  const strategy = getCacheStrategy(event.request);
  
  switch (strategy) {
    case CACHE_STRATEGY.CACHE_FIRST:
      event.respondWith(handleCacheFirst(event.request, CACHE_NAME));
      break;
      
    case CACHE_STRATEGY.NETWORK_FIRST:
      event.respondWith(handleNetworkFirst(event.request, CACHE_NAME));
      break;
      
    default:
      event.respondWith(fetch(event.request));
  }
});

// Evento: Notificações push
self.addEventListener('push', (event) => {
  const title = 'FoodFlow';
  const options = {
    body: event.data?.text() || 'Nova notificação do FoodFlow',
    icon: '/assets/icons/pwa-192x192.png',
    badge: '/assets/icons/pwa-192x192.png',
    vibrate: [200, 100, 200, 100, 200, 100, 400],
    tag: 'foodflow-notification'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Evento: Clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Evento: Sincronização em segundo plano
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// Função de exemplo para sincronização
async function syncData() {
  // Implemente a lógica de sincronização aqui
  console.log('Sincronizando dados em segundo plano...');
}
