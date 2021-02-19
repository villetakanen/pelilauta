/* eslint-disable */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js')

workbox.setConfig({
  debug: false
})

let precache = self.__WB_MANIFEST
if (!precache) precache = [{"revision":null,"url":"index.html"}]

workbox.precaching.precacheAndRoute(precache)

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting().then(() => {
      console.debug('sw.js, skipWaiting finished')
    })
  }
})
workbox.routing.registerRoute(
  ({request}) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'pelilauta-image-cache'
  })
)

workbox.routing.registerRoute(
  ({url}) => url.origin === 'https://fonts.googleapis.com' ||
             url.origin === 'https://fonts.gstatic.com',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'google-fonts',
      plugins: [
        new workbox.expiration.ExpirationPlugin({maxEntries: 30}),
      ],
    }),
)
