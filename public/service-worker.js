
// Service Worker for Betterlink SchoolConnect App

const CACHE_NAME = 'schoolconnect-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/icons/notification-icon.png',
  '/icons/badge-icon.png',
  // Add other assets you want to cache
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          (response) => {
            // Don't cache responses that aren't successful
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response since it can only be consumed once
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
      .catch(() => {
        // If both cache and network fail, show offline page
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  let notification = {};
  
  try {
    notification = event.data.json();
  } catch (e) {
    notification = {
      title: 'New Notification',
      message: event.data ? event.data.text() : 'No details available',
      icon: '/icons/notification-icon.png'
    };
  }
  
  const options = {
    body: notification.message || 'You have a new notification',
    icon: notification.icon || '/icons/notification-icon.png',
    badge: '/icons/badge-icon.png',
    data: {
      url: notification.link || '/',
      notificationId: notification.id || null
    },
    actions: [
      {
        action: 'view',
        title: 'View',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(notification.title || 'SchoolConnect', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  const urlToOpen = event.notification.data?.url || '/';
  const notificationId = event.notification.data?.notificationId;
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // If a window client is already open, focus it and navigate
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          client.focus();
          
          // If we have a notification ID, mark it as read
          if (notificationId) {
            client.postMessage({
              type: 'NOTIFICATION_CLICKED',
              notificationId
            });
          }
          
          return;
        }
      }
      
      // Otherwise, open a new window
      if (clients.openWindow) {
        clients.openWindow(urlToOpen).then((client) => {
          // If we have a notification ID, mark it as read
          if (client && notificationId) {
            client.postMessage({
              type: 'NOTIFICATION_CLICKED',
              notificationId
            });
          }
        });
      }
    })
  );
});