// public/sw.js
self.addEventListener('install', (e) => {
  console.log('✅ Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  console.log('✅ Service Worker activated');
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only intercept same-origin GET requests
  if (request.method === 'GET' && url.origin === self.location.origin) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response('Offline or failed to fetch', {
          status: 503,
          statusText: 'Service Unavailable',
        });
      })
    );
  }
});