import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

// Limpa caches antigos e ativa imediatamente o novo SW
cleanupOutdatedCaches();
self.skipWaiting();
clientsClaim();

// Pre-cache os recursos compilados pelo Vite
precacheAndRoute(self.__WB_MANIFEST || []);

// --- Lógica de Push Notifications Mantida ---
self.addEventListener('push', (event) => {
  let title = 'GenteGestão RH';
  let options = {
    body: 'Você tem uma nova notificação.',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    requireInteraction: true,
    silent: false
  };

  if (event.data) {
    try {
      const data = event.data.json();
      title = data.title || title;
      options.body = data.body || options.body;
      if (data.icon) options.icon = data.icon;
      if (data.url) options.data = { url: data.url };
    } catch (e) {
      options.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
