
// Service Worker for handling push notifications

const CACHE_NAME = 'betterlink-schoolconnect-v1';
const OFFLINE_URL = '/offline.html';

// Install event - cache essential files for offline use
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/offline.html',
        '/icons/notification-icon.png',
        '/icons/badge-icon.png'
      ]);
    })
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Claim clients so the service worker is in control immediately
  self.clients.claim();
});

// Fetch event - serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(event.request)
        .then((response) => {
          // Don't cache responses that aren't successful
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response since it can only be consumed once
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        })
        .catch(() => {
          // If the request is for a page, return the offline page
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
          
          // Otherwise just return a 404 response
          return new Response('Not found', { status: 404 });
        });
    })
  );
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push event received');
  
  let notificationData = {};
  
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      notificationData = {
        title: 'New Notification',
        message: event.data.text()
      };
    }
  } else {
    notificationData = {
      title: 'New Notification',
      message: 'You have a new notification'
    };
  }
  
  const title = notificationData.title || 'SchoolConnect';
  const options = {
    body: notificationData.message || 'You have a new notification',
    icon: '/icons/notification-icon.png',
    badge: '/icons/badge-icon.png',
    data: {
      url: notificationData.actionUrl || '/',
      notificationType: notificationData.type || 'message'
    },
    vibrate: [100, 50, 100],
    timestamp: notificationData.timestamp || Date.now()
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
      .then(() => {
        // Also notify any open clients
        return self.clients.matchAll({ type: 'window' });
      })
      .then((clients) => {
        if (clients && clients.length) {
          // Send a message to all clients
          clients.forEach((client) => {
            client.postMessage({
              type: 'NOTIFICATION',
              id: Date.now().toString(),
              title: notificationData.title,
              message: notificationData.message,
              timestamp: new Date().toISOString(),
              notificationType: notificationData.type || 'message',
              actionUrl: notificationData.actionUrl
            });
          });
        }
      })
  );
});

// Notification click event - open the relevant page when notification is clicked
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received');
  
  event.notification.close();
  
  const urlToOpen = event.notification.data && event.notification.data.url
    ? new URL(event.notification.data.url, self.location.origin).href
    : self.location.origin;
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no window/tab is open with the target URL, open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Message event - handle messages from the main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});