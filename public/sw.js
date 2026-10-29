// Hasana service worker: offline support + Firebase push messages.
// - App shell (HTML, JS, CSS, fonts) is cached so the app opens without internet.
// - API reads are network-first; when offline they come from the last cached copy
//   or from the downloaded offline packs (Quran / hadith / duas) stored in OFFLINE_DATA.
// Bump SW_VERSION when this file's caching logic changes.

const SW_VERSION = 'v1';
const SHELL_CACHE = `hasana-shell-${SW_VERSION}`;
const ASSET_CACHE = 'hasana-assets';
const API_CACHE = 'hasana-api';
const OFFLINE_DATA = 'hasana-offline-data'; // written by resources/js/app/services/offlineStore.js
const API_CACHE_LIMIT = 300;
const NETWORK_TIMEOUT_MS = 6000;
const APP_ENTRIES = ['resources/js/app/main.jsx', 'resources/css/app.css'];
const SPA_ROUTES = ['/', '/quran', '/hadith', '/duas', '/umrah-guide', '/bookmarks', '/settings', '/about', '/prayer-times', '/tasbih', '/features'];

// ---------------------------------------------------------------------------
// Firebase Cloud Messaging (background push on the website)
// ---------------------------------------------------------------------------
try {
  importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

  firebase.initializeApp({
    projectId: 'apptimatic-f509c',
    appId: '1:1021648500578:android:ac8cecc83012c449a05e3b',
    storageBucket: 'apptimatic-f509c.firebasestorage.app',
    apiKey: 'AIzaSyDMHS1fN8WRhl6hFg-nK13mB9g2CpKEJV4',
    authDomain: 'apptimatic-f509c.firebaseapp.com',
    messagingSenderId: '1021648500578',
    measurementId: 'G-5KSZPSQZ6S',
  });

  firebase.messaging().onBackgroundMessage((payload) => {
    const isAyah = payload.data?.type === 'daily_ayah';
    const title = payload.notification?.title || payload.data?.title || (isAyah ? 'আজকের দিনের আয়াত 📖' : 'নামাজের সময় হয়েছে 🕌');

    return self.registration.showNotification(title, {
      body: payload.notification?.body || payload.data?.body || (isAyah ? 'আজকের দিনের কোরআনিক বাণী ও হেদায়েত পড়ুন।' : 'আসুন নামাজের প্রস্তুতি গ্রহণ করি।'),
      icon: '/favicon.png',
      badge: '/favicon.png',
      tag: payload.data?.tag || (isAyah ? 'daily-ayah' : 'namaz-notification'),
      // The open tab may already have shown this same prayer (same tag): replace it silently
      renotify: false,
      vibrate: [300, 150, 300, 150, 400],
      sound: '/sounds/notification-soothing.wav',
      data: { url: payload.data?.url || payload.data?.deep_link || '/' },
    });
  });
} catch (err) {
  // Firebase scripts can't load (e.g. first start while offline); caching still works
  console.warn('[sw] Firebase messaging unavailable:', err);
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus().then((focused) => ('navigate' in focused ? focused.navigate(urlToOpen) : focused));
        }
      }
      return clients.openWindow ? clients.openWindow(urlToOpen) : undefined;
    })
  );
});

// ---------------------------------------------------------------------------
// Install / activate: precache the app shell
// ---------------------------------------------------------------------------

// Every built file the public app needs, read from Vite's manifest (follows imports, CSS, fonts)
const appBuildFiles = async () => {
  const res = await fetch('/build/manifest.json', { cache: 'no-store' });
  const manifest = await res.json();
  const files = new Set();
  const visit = (key) => {
    const chunk = manifest[key];
    if (!chunk || files.has(`/build/${chunk.file}`)) return;
    files.add(`/build/${chunk.file}`);
    (chunk.css || []).forEach((f) => files.add(`/build/${f}`));
    (chunk.assets || []).forEach((f) => files.add(`/build/${f}`));
    (chunk.imports || []).forEach(visit);
    (chunk.dynamicImports || []).forEach(visit);
  };
  APP_ENTRIES.forEach(visit);
  return [...files];
};

// Cache the current build and drop files from older builds.
// The HTML shell is refreshed first, so the cached shell never points at deleted files.
const syncAppShell = async () => {
  const files = await appBuildFiles();
  const shellResponse = await fetch('/', { cache: 'no-store' });
  if (!shellResponse.ok) return;
  await (await caches.open(SHELL_CACHE)).put('/', shellResponse);

  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.keys();
  const wanted = new Set(files.map((f) => new URL(f, self.location.origin).href));

  await Promise.all(files.map(async (file) => {
    if (!(await cache.match(file))) {
      try {
        await cache.add(file);
      } catch {
        // Retried on the next sync
      }
    }
  }));

  await Promise.all(
    cached
      .filter((req) => new URL(req.url).pathname.startsWith('/build/assets/') && !wanted.has(req.url))
      .map((req) => cache.delete(req))
  );
};

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const shell = await caches.open(SHELL_CACHE);
    await shell.addAll(['/', '/favicon.png']).catch(() => {});
    await syncAppShell().catch(() => {});
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names
        .filter((name) => name.startsWith('hasana-shell-') && name !== SHELL_CACHE)
        .map((name) => caches.delete(name))
    );
    await self.clients.claim();
  })());
});

// The page asks for a re-sync after every load, so a new deploy gets cached even when sw.js is unchanged
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SYNC_APP_SHELL') {
    event.waitUntil(syncAppShell().catch(() => {}));
  }
});

// ---------------------------------------------------------------------------
// Fetch strategies
// ---------------------------------------------------------------------------

const withTimeout = (promise, ms) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('timeout')), ms);
  promise.then((v) => { clearTimeout(timer); resolve(v); }, (e) => { clearTimeout(timer); reject(e); });
});

const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Hasana-Offline': '1' },
});

const trimCache = async (name, limit) => {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  if (keys.length > limit) {
    await Promise.all(keys.slice(0, keys.length - limit).map((k) => cache.delete(k)));
  }
};

// HTML pages: network first (fresh content), cached shell when offline. All SPA routes share one shell.
const handleNavigation = async (request) => {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const response = await withTimeout(fetch(request), NETWORK_TIMEOUT_MS);
    if (response.ok && SPA_ROUTES.includes(new URL(request.url).pathname)) {
      cache.put('/', response.clone());
    }
    return response;
  } catch {
    return (await cache.match('/')) || offlinePage();
  }
};

const offlinePage = () => new Response(
  `<!doctype html><html lang="bn"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>হাসানা — অফলাইন</title><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
  background:#0d3b34;color:#fff;font-family:sans-serif;text-align:center;padding:24px}button{margin-top:20px;padding:12px 24px;border:0;
  border-radius:999px;background:#dfab3b;color:#0d3b34;font-weight:700;font-size:15px}</style></head><body><div>
  <div style="font-size:56px;color:#dfab3b">حسنة</div><h1 style="font-size:22px">ইন্টারনেট সংযোগ নেই</h1>
  <p style="opacity:.8;line-height:1.7">প্রথমবার অ্যাপ চালু করতে ইন্টারনেট প্রয়োজন।<br>এরপর থেকে কুরআন অফলাইনেও পড়া যাবে।</p>
  <button onclick="location.reload()">আবার চেষ্টা করুন</button></div></body></html>`,
  { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
);

// Hashed build files never change: cache first
const handleBuildAsset = async (request) => {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
};

// Images & other static files: serve cached copy, refresh in the background
const handleStatic = async (request) => {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  return cached || network;
};

// Offline answer for an API request: downloaded pack first, then the last cached copy
const offlineFallback = async (request, url) =>
  (await offlineApiResponse(url)) || (await caches.match(request, { cacheName: API_CACHE }));

// API reads: network first. If the network is slow, answer from offline data when we have it,
// otherwise keep waiting for the network. Offline with no data → a 503 JSON the pages can handle.
const handleApi = async (request, url) => {
  const network = fetch(request).then(async (response) => {
    // Search results are not worth keeping; everything else is cached for offline use
    if (response.ok && !url.searchParams.get('query')) {
      const cache = await caches.open(API_CACHE);
      await cache.put(request, response.clone());
      trimCache(API_CACHE, API_CACHE_LIMIT);
    }
    return response;
  });
  network.catch(() => {}); // handled below; avoids an unhandled-rejection warning

  try {
    return await withTimeout(network, NETWORK_TIMEOUT_MS);
  } catch {
    const fallback = await offlineFallback(request, url);
    if (fallback) return fallback;

    try {
      return await network;
    } catch {
      return jsonResponse({ offline: true, message: 'আপনি অফলাইনে আছেন। এই তথ্যটি এখনও ডাউনলোড করা হয়নি।', data: [] }, 503);
    }
  }
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/login') || url.pathname.startsWith('/logout')) return;

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
  } else if (url.pathname.startsWith('/api/offline/')) {
    // Large pack downloads go straight to the network (no timeout, not cached here)
  } else if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApi(request, url));
  } else if (url.pathname.startsWith('/build/')) {
    event.respondWith(handleBuildAsset(request));
  } else if (/\.(png|jpe?g|webp|svg|gif|ico|woff2?|ttf|json)$/i.test(url.pathname)) {
    event.respondWith(handleStatic(request));
  }
});

// ---------------------------------------------------------------------------
// Answer API requests from the downloaded offline packs (same JSON shape as the server)
// ---------------------------------------------------------------------------

const readPack = async (key) => {
  const response = await caches.match(`/__offline/${key}`, { cacheName: OFFLINE_DATA });
  return response ? response.json() : null;
};

const matchesQuery = (item, query, fields) => {
  if (!query) return true;
  const q = query.toLowerCase();
  return fields.some((f) => String(item[f] || '').toLowerCase().includes(q));
};

const paginate = (items, url, defaultPerPage, maxPerPage) => {
  const perPage = Math.max(5, Math.min(parseInt(url.searchParams.get('per_page') || defaultPerPage, 10) || defaultPerPage, maxPerPage));
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10) || 1);
  const lastPage = Math.max(1, Math.ceil(items.length / perPage));
  return {
    data: items.slice((page - 1) * perPage, page * perPage),
    meta: { current_page: page, last_page: lastPage, per_page: perPage, total: items.length },
  };
};

const filterByCategory = (items, category) => {
  if (!category || category === 'all') return items;
  if (category === 'uncategorised') return items.filter((i) => !i.category);
  return items.filter((i) => i.category?.slug === category);
};

const offlineApiResponse = async (url) => {
  const path = url.pathname;
  const query = (url.searchParams.get('query') || '').trim();

  if (path === '/api/surahs') {
    const list = await readPack('quran/list');
    if (!list) return null;
    const items = list.filter((s) => matchesQuery(s, query, ['name_en', 'name_ar', 'name_bn', 'slug', 'meaning_bn']));
    return jsonResponse(paginate(items, url, 30, 150));
  }

  const surahMatch = path.match(/^\/api\/surahs\/([^/]+)$/);
  if (surahMatch) {
    const surah = await readPack(`quran/surah/${decodeURIComponent(surahMatch[1])}`);
    if (!surah) return null;
    const ayahs = surah.ayahs.filter((a) => matchesQuery(a, query, ['text_bn', 'text_ar']));
    return jsonResponse({ data: surah.data, ayahs: paginate(ayahs, url, 20, 100) });
  }

  if (path === '/api/hadith/categories') {
    const categories = await readPack('hadith/categories');
    return categories ? jsonResponse({ data: categories }) : null;
  }

  if (path === '/api/hadiths') {
    const category = url.searchParams.get('category') || 'all';
    const categories = (await readPack('hadith/categories')) || [];
    const slugs = category === 'all' ? categories.map((c) => c.slug) : [category];
    const packs = await Promise.all(slugs.map((slug) => readPack(`hadith/category/${slug}`)));
    if (!packs.some(Boolean)) return null;
    const items = packs.filter(Boolean).flat()
      .filter((h) => matchesQuery(h, query, ['title', 'text_bn', 'text_ar', 'reference']));
    return jsonResponse(paginate(items, url, 12, 100));
  }

  if (path === '/api/dua/categories') {
    const categories = await readPack('dua/categories');
    return categories ? jsonResponse({ data: categories }) : null;
  }

  if (path === '/api/duas') {
    const duas = await readPack('dua/all');
    if (!duas) return null;
    const items = filterByCategory(duas, url.searchParams.get('category'))
      .filter((d) => matchesQuery(d, query, ['title', 'text_bn', 'text_ar', 'reference']));
    return jsonResponse(paginate(items, url, 12, 250));
  }

  return null;
};
