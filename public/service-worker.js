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

