const CACHE_NAME = 'lab-8-starter';
const ASSETS_TO_CACHE = [
  '/',                    // alias for index.html
  '/index.html',
  '/manifest.json',       // PWA manifest
  '/sw.js',               // service worker script

  // Icon assets
  '/assets/images/icons/0-star.svg',
  '/assets/images/icons/1-star.svg',
  '/assets/images/icons/2-star.svg',
  '/assets/images/icons/3-star.svg',
  '/assets/images/icons/4-star.svg',
  '/assets/images/icons/5-star.svg',
  '/assets/images/icons/arrow-down.png',

  // App shell
  '/assets/scripts/main.js',
  '/assets/scripts/RecipeCard.js',
  '/assets/styles/main.css',

  // Recipe data
  '/recipes/1_50-thanksgiving-side-dishes.json',
  '/recipes/2_roasting-turkey-breast-with-stuffing.json',
  '/recipes/3_moms-cornbread-stuffing.json',
  '/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
  '/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
  '/recipes/6_one-pot-thanksgiving-dinner.json'
];

// Install event: cache app shell & recipe data
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate event: clean up old caches and take control
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch event: serve from cache, fall back to network & cache the result
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});
