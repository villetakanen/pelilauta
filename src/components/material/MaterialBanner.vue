<template>
  <transition>
    <div v-if="true || updatesAvailable" :class="`material-banner ${updatesAvailable ? 'show' : ''}`">
      <div class="banner-container">
      <p v-if="updatesAvailable">Update available!</p>
        <div class="actions">
          <button class="action action-text" @click="updatesAvailable=false">Cancel</button>
          <button class="action action-text" @click="acceptUpdate">Update</button>
        </div>
      </div>
    </div>
  </transition>
  <!-- To debug trasitions, uncomment this: - ->
  <button class="action action-text" @click="updatesAvailable=true">Force Banner On</button>
  <!- - //debu -->
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue'
import { register } from 'register-service-worker'

export default defineComponent({
  setup () {
    const updatesAvailable: Ref = ref(false)
    let swr: ServiceWorkerRegistration|undefined

    // ************************************************************************
    // * SETUP WORKBOX/SPA AND THE UPDATE BUTTON HERE                         *
    // * TODO: MOVE TO A COMPONENT WHEN FUNCTIONAL       .                     *
    // ************************************************************************

    register('/service-worker.js', {
      registrationOptions: { scope: './' },
      ready (registration) {
        console.log('Service worker is active.', registration)
      },
      registered (registration) {
        console.log('Service worker has been registered.')
        setInterval(() => {
          registration.update()
        }, 100) // 1000 * 60) // minute checks for testing * 60) // e.g. hourly checks
      },
      cached (registration) {
        console.log('Content has been cached for offline use.', registration)
      },
      updatefound (registration) {
        console.log('New content is downloading.', registration)
      },
      updated (registration: ServiceWorkerRegistration) {
        console.log('New content is available; please refresh.')
        updatesAvailable.value = true
        swr = registration
      },
      offline () {
        console.log('No internet connection found. App is running in offline mode.')
      },
      error (error) {
        console.error('Error during service worker registration:', error)
      }
    })

    let refreshing = false
    // Refresh all open app tabs when a new service worker is installed.
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return
      refreshing = true
      window.location.reload()
    })

    function acceptUpdate () {
      if (!swr || !swr.waiting) { return }
      swr.waiting.postMessage('skipWaiting')
    }

    // *** end SETUP WORKBOX/SPA AND THE UPDATE BUTTON HERE *******************

    return { updatesAvailable, acceptUpdate }
  }
})
</script>
