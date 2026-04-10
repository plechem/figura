// Figura Service Worker — network-first (always fresh in dev; offline fallback retained)
const CACHE = 'figura-v25';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  'https://cdn.jsdelivr.net/npm/@vexflow-fonts/bravura/bravura.woff2',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first: always try the network so a plain refresh picks up changes.
// Falls back to cache only when offline.
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(res => {
      if (!res || res.status !== 200 || (res.type !== 'basic' && res.type !== 'cors')) return res;
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }).catch(() =>
      caches.match(e.request).then(cached => cached ?? caches.match('./index.html'))
    )
  );
});
