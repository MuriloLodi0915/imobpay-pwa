// Configurações do PWA
const PWA_CONFIG = {
  cacheName: 'imobpay-v1.0.0',
  urlsToCache: [
    '/',
    '/static/js/bundle.js',
    '/static/css/main.css',
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png',
    '/apple-touch-icon.png',
    '/offline.html'
  ],
  apiCacheName: 'imobpay-api-v1.0.0',
  imageCacheName: 'imobpay-images-v1.0.0'
};

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(PWA_CONFIG.cacheName)
      .then((cache) => {
        console.log('Service Worker: Cache aberto');
        return cache.addAll(PWA_CONFIG.urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Instalação concluída');
        return self.skipWaiting();
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Ativando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== PWA_CONFIG.cacheName && 
              cacheName !== PWA_CONFIG.apiCacheName && 
              cacheName !== PWA_CONFIG.imageCacheName) {
            console.log('Service Worker: Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Ativação concluída');
      return self.clients.claim();
    })
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Estratégia de cache baseada no tipo de recurso
  if (request.method === 'GET') {
    if (url.pathname.startsWith('/api/')) {
      // API: Network first, fallback to cache
      event.respondWith(handleApiRequest(request));
    } else if (isImageRequest(request)) {
      // Imagens: Cache first, fallback to network
      event.respondWith(handleImageRequest(request));
    } else if (isStaticAsset(request)) {
      // Assets estáticos: Cache first
      event.respondWith(handleStaticAssetRequest(request));
    } else {
      // Páginas: Network first, fallback to cache
      event.respondWith(handlePageRequest(request));
    }
  }
});

// Função para requisições de API
async function handleApiRequest(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(PWA_CONFIG.apiCacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Função para requisições de imagens
async function handleImageRequest(request) {
  const cache = await caches.open(PWA_CONFIG.imageCacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Retornar uma imagem padrão se não conseguir carregar
    return cache.match('/icon-192x192.png');
  }
}

// Função para assets estáticos
async function handleStaticAssetRequest(request) {
  const cache = await caches.open(PWA_CONFIG.cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    throw error;
  }
}

// Função para requisições de páginas
async function handlePageRequest(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(PWA_CONFIG.cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback para página offline
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

// Funções auxiliares
function isImageRequest(request) {
  return request.destination === 'image' || 
         request.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
}

function isStaticAsset(request) {
  return request.destination === 'script' || 
         request.destination === 'style' ||
         request.url.match(/\.(js|css|woff|woff2|ttf|eot)$/i);
}

// Sincronização em background
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Sincronização em background iniciada');
    event.waitUntil(doBackgroundSync());
  }
});

// Notificações push
self.addEventListener('push', (event) => {
  console.log('Service Worker: Notificação push recebida');
  
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do ImobPay',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver detalhes',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('ImobPay', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notificação clicada');
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  } else if (event.action === 'close') {
    // Apenas fechar a notificação
    return;
  } else {
    // Clique na notificação principal
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Função para sincronização em background
async function doBackgroundSync() {
  try {
    // Aqui você pode implementar a sincronização de dados
    // Por exemplo, sincronizar dados offline com o servidor
    
    // Simular sincronização
    console.log('Service Worker: Sincronizando dados...');
    
    // Limpar caches antigos se necessário
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
      name !== PWA_CONFIG.cacheName && 
      name !== PWA_CONFIG.apiCacheName && 
      name !== PWA_CONFIG.imageCacheName
    );
    
    await Promise.all(oldCaches.map(name => caches.delete(name)));
    
    console.log('Service Worker: Sincronização concluída');
  } catch (error) {
    console.error('Service Worker: Erro na sincronização:', error);
  }
}

// Mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: PWA_CONFIG.cacheName });
  }
}); 