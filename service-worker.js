/* ==========================================================================
   VYBE-X Service Worker
   Production PWA offline caching & runtime management
   Creator: Shiv Yogi
   ========================================================================== */

const CACHE_NAME = 'vybe-x-v1.0.0';

// Relative assets to cache during installation
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/logo.svg',
  './assets/icons/icon-192.svg',
  './assets/icons/icon-512.svg',
  './css/main.css',
  './css/liquid-glass.css',
  './css/visualizers.css',
  './css/animations.css',
  './js/app.js',
  './js/audio-engine.js',
  './js/visualizer-engine.js',
  './js/fullscreen.js',
  './js/settings.js',
  './js/performance.js',
  './animations/rgb-pulse.js',
  './animations/laser-sweep.js',
  './animations/particle-explosion.js',
  './animations/fluid-motion.js',
  './animations/aurora-motion.js',
  './visualizers/waveforms.js',
  './visualizers/spectrum.js',
  './visualizers/circular.js',
  './visualizers/particles.js',
  './visualizers/geometric.js',
  './visualizers/rgb-neon.js',
  './visualizers/lasers.js',
  './visualizers/tunnels.js',
  './visualizers/fluid-energy.js',
  './visualizers/special-effects.js'
];

// Install Event - Precache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS.map(url => new Request(url, { cache: 'no-cache' })));
      })
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.warn('[VYBE-X SW] Precache warning:', err);
      })
  );
});

// Activate Event - Clean up stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((existingCache) => {
          if (existingCache !== CACHE_NAME) {
            return caches.delete(existingCache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Cache-first with network fallback for assets, never cache user media blobs
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never cache blob: or data: URIs (used for local audio files) or microphone streams
  if (url.protocol === 'blob:' || url.protocol === 'data:' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Same-origin or relative request handling
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached response and update in background if online
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          }).catch(() => {
            /* Offline, cache is sufficient */
          });
          return cachedResponse;
        }

        // Fetch from network
        return fetch(request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return networkResponse;
        }).catch(() => {
          // If offline and navigating, return index.html
          if (request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
    );
  }
});
