const CACHE = 'inventory-v1'

// Cache the app shell on install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(['/', '/index.html']))
  )
  self.skipWaiting()
})

// Clean up old cache versions on activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Network-first for the items API: serve fresh data when online, cache when not
  if (url.pathname.startsWith('/api/items') && request.method === 'GET') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone()
          caches.open(CACHE).then(cache => {
            try { cache.put(request, clone) } catch (_) { /* opaque cross-origin */ }
          })
          return response
        })
        .catch(() => caches.match(request))
    )
    return
  }

  // Cache-first for static assets (JS, CSS, images)
  if (request.destination !== 'document') {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(response => {
          const clone = response.clone()
          caches.open(CACHE).then(cache => cache.put(request, clone))
          return response
        })
      })
    )
    return
  }

  // Network-first for HTML pages, fall back to cached index
  event.respondWith(
    fetch(request)
      .then(response => {
        const clone = response.clone()
        caches.open(CACHE).then(cache => cache.put(request, clone))
        return response
      })
      .catch(() => caches.match(request).then(cached => cached || caches.match('/index.html')))
  )
})