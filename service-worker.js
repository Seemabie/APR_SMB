// Service Worker for Push Notifications and Offline Support
const CACHE_NAME = 'love-compass-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Push notification handler
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'You have a new love message! 💕',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore',
        title: 'Open Love Compass',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('💕 Seemab & Arpita Love Compass', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/'));
  }
});

// Background sync for offline functionality
self.addEventListener('sync', event => {
  if (event.tag === 'love-sync') {
    event.waitUntil(doLoveSync());
  }
});

function doLoveSync() {
  // Sync love data when back online
  return Promise.resolve();
}

// Handle notification actions
self.addEventListener('notificationclick', event => {
  const action = event.action;
  const notification = event.notification;
  
  notification.close();
  
  switch(action) {
    case 'respond':
      // Open the app to respond
      event.waitUntil(
        clients.openWindow('/?action=respond')
      );
      break;
    case 'call':
      // Could integrate with phone dialer
      event.waitUntil(
        clients.openWindow('tel:+1234567890') // Replace with actual number
      );
      break;
    case 'read':
      // Open to daily tab
      event.waitUntil(
        clients.openWindow('/?tab=daily')
      );
      break;
    default:
      // Default action - just open the app
      event.waitUntil(
        clients.openWindow('/')
      );
  }
});