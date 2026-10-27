// Firebase Messaging Service Worker for Hasana App (Project: apptimatic-f509c)
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  projectId: "apptimatic-f509c",
  appId: "1:1021648500578:android:ac8cecc83012c449a05e3b",
  storageBucket: "apptimatic-f509c.firebasestorage.app",
  apiKey: "AIzaSyBfKF39sjZkrMExahRp8eMY86dKwsmGRC8",
  authDomain: "apptimatic-f509c.firebaseapp.com",
  messagingSenderId: "1021648500578",
  measurementId: "G-5KSZPSQZ6S"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const isAyah = payload.data?.type === 'daily_ayah' || payload.notification?.title?.includes('আয়াত');
  const defaultTitle = isAyah ? 'আজকের দিনের আয়াত 📖' : 'নামাজের সময় হয়েছে 🕌';
  const defaultBody = isAyah ? 'আজকের দিনের কোরআনিক বাণী ও হেদায়েত পড়ুন।' : 'আসুন নামাজের প্রস্তুতি গ্রহণ করি।';

  const notificationTitle = payload.notification?.title || payload.data?.title || defaultTitle;
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || defaultBody,
    icon: '/favicon.png',
    badge: '/favicon.png',
    tag: payload.data?.tag || (isAyah ? 'daily-ayah' : 'namaz-notification'),
    renotify: true,
    vibrate: [300, 150, 300, 150, 400],
    data: {
      url: payload.data?.url || payload.data?.deep_link || '/'
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
