/* eslint-disable */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js')

workbox.setConfig({
  debug: false
})

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`)
} else {
  console.log(`Boo! Workbox didn't load 😬`)
}

let precache = self.__WB_MANIFEST
if (!precache) precache = [{"revision":null,"url":"index.html"}]

workbox.precaching.precacheAndRoute(precache)

 

self.addEventListener('message', (event) => {
  if (!event.data?.type) return
  console.debug('sw.js, message:', event.data?.type)
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting().then(() => {
      console.debug('sw.js, skipWaiting finished')
    })
  }
})

let CACHE_NAME = 'pelilauta-images-cache'
self.addEventListener("fetch", function(e) {
  e.respondWith((async function() {
    const cachedResponse = await caches.match(e.request)
    if (cachedResponse) {
      return cachedResponse
    }

    const networkResponse = await fetch(e.request)

    const hosts = [
      'https://fonts.googleapis.com',
      'https://firebasestorage.googleapis.com'
    ]

    if (hosts.some((host) => e.request.url.startsWith(host))) {
      // This clone() happens before `return networkResponse` 
      const clonedResponse = networkResponse.clone();

      e.waitUntil((async function() {
        const cache = await caches.open(CACHE_NAME)
        // This will be called after `return networkResponse`
        // so make sure you already have the clone!
        await cache.put(e.request, clonedResponse)
      })())
    }

    return networkResponse
  })())
})
