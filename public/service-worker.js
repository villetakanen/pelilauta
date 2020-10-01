/* eslint-disable */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js')

/* if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`)
} else {
  console.log(`Boo! Workbox didn't load 😬`)
} */

let precache = self.__WB_MANIFEST
if (!precache) precache = [{"revision":null,"url":"index.html"}]

workbox.precaching.precacheAndRoute(precache)

self.addEventListener('message', (event) => {
    if (event.data && event.data === 'skipWaiting') {
      self.skipWaiting()
    }
  })

