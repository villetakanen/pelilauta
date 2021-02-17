/* eslint-disable */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js')

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`)
} else {
  console.log(`Boo! Workbox didn't load 😬`)
}

let precache = self.__WB_MANIFEST
if (!precache) precache = [{"revision":null,"url":"index.html"}]

workbox.precaching.precacheAndRoute(precache)

self.addEventListener('message', (event) => {
    if (event.data && event.data === 'skipWaiting') {
      console.log(`Workbox is done with waiting 😬`)
      return self.skipWaiting()
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
