// RisePath service worker: precache the app shell, then stale-while-revalidate.
const CACHE = 'risepath-v1';
const SHELL = [
  './', './index.html', './manifest.webmanifest',
  './css/style.css',
  './js/i18n.js', './js/validation.js', './js/store.js', './js/scoring-engine.js', './js/screens.js', './js/app.js',
  './data/opportunities.json', './data/mentors.json',
  './assets/icons/icon.svg', './assets/icons/icon-192.png', './assets/icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => hit || caches.match('./index.html'));
      return hit || net;
    })
  );
});
