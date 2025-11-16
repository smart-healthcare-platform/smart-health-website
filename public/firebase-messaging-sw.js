// Firebase Cloud Messaging Service Worker
// This handles background notifications when the app is not in focus

// Use latest stable version
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
try {
  firebase.initializeApp({
    apiKey: "AIzaSyD4CEW0Cfm2VJj7HMahsSDbsJz1FTwEeyQ",
    authDomain: "vv-smart-health.firebaseapp.com",
    projectId: "vv-smart-health",
    storageBucket: "vv-smart-health.firebasestorage.app",
    messagingSenderId: "380705781611",
    appId: "1:380705781611:web:c122cc435625cf5d3afe2e",
    measurementId: "G-G2X3H7W26L"
  });
  console.log('[SW] Firebase initialized successfully');
} catch (error) {
  console.error('[SW] Firebase initialization failed:', error);
}

const messaging = firebase.messaging();

// Log service worker activation
self.addEventListener('activate', (event) => {
  console.log('[SW] Service worker activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('install', () => {
  console.log('[SW] Service worker installed');
  self.skipWaiting();
});

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Received background message', payload);

  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: payload.data?.conversationId || 'default',
    data: payload.data,
    requireInteraction: false,
    actions: [
      {
        action: 'view',
        title: 'View',
      },
      {
        action: 'close',
        title: 'Close',
      }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Note: Push events are handled by messaging.onBackgroundMessage above
// No need for additional push event listener to avoid duplicate notifications

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked', event);

  event.notification.close();

  const action = event.action;
  const notificationData = event.notification.data;

  if (action === 'close') {
    return;
  }

  // Open the app or navigate to specific page
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If there's an open window, focus it
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }

      // Otherwise open a new window
      if (clients.openWindow) {
        let url = '/';

        // Navigate to specific page based on notification data
        if (notificationData?.conversationId) {
          url = `/chat/${notificationData.conversationId}`;
        } else if (notificationData?.appointmentId) {
          url = `/appointments/${notificationData.appointmentId}`;
        }

        return clients.openWindow(url);
      }
    })
  );
});

// Handle errors
self.addEventListener('error', (event) => {
  console.error('[SW] Service worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled promise rejection:', event.reason);
});

console.log('[SW] Service worker script loaded');