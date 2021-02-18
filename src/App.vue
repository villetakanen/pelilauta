<template>
  <!-- The top navigation bar: contains search field, menu button, and search button. Maybe profile icon too. -->
  <AppBar />
  <div id="AppBarSubmenu" />
  <!-- The side navigation drawer, with mobile and desktop modes distinctively -->
  <div style="position: relative">
    <SideNav v-model="navModel" />
    <div
      id="mainContentWrapper"
      :class="{toggle: !navModel}"
    >
      <main>
        <router-view />
        <MainTailer />
      </main>
    </div>
  </div>
  <BottomFloatContainer>
    <template #left>
      <SnackBar />
    </template>
    <template #right>
      <div id="BottomFabsContainer" />
    </template>
  </BottomFloatContainer>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, provide, ref, watch } from 'vue'
import SideNav from '@/components/app/SideNav.vue'
import AppBar from '@/components/app/AppBar.vue'
import MainTailer from '@/components/app/MainTailer.vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useSnack } from '@/composables/useSnack'
import SnackBar from './components/app/SnackBar.vue'
import BottomFloatContainer from './components/material/BottomFloatContainer.vue'
import { useAuthState, useProfile } from './state/authz'
import { Workbox, messageSW } from 'workbox-window'
import { WorkboxLifecycleEvent } from 'workbox-window/utils/WorkboxEvent'

export default defineComponent({
  components: {
    SideNav,
    AppBar,
    MainTailer,
    SnackBar,
    BottomFloatContainer// ,
    // MekanismiBar
  },
  setup () {
    const { isAnonymous } = useAuthState()
    const { profileMeta } = useProfile()
    const i18n = useI18n()
    const route = useRoute()
    onMounted(() => {
      watch(
        profileMeta, (l) => { i18n.locale.value = l.pelilautaLang || 'en' },
        { immediate: true }
      )
    })

    const { pushSnack } = useSnack()
    provide('pushSnack', pushSnack)

    // Navigation drawer programmatic visibility
    const navModel = ref(window.innerWidth < 768)
    const mobileView = computed(() => (window.innerWidth < 768))
    const toggleNav = () => {
      navModel.value = !navModel.value
    }
    provide('navModel', navModel)
    provide('toggleNav', toggleNav)
    provide('mobileViewport', mobileView)

    const mekanismi = computed(() => ((route.name || '').toString().split('.')[0] === 'mekanismi'))
    provide('appMode', mekanismi)

    // *** Workbox/Service worker setup starts ******************************

    let skipWaiting: CallableFunction|undefined
    if ('serviceWorker' in navigator) {
      console.debug('App.vue: starts installing the Workbox')
      const workbox = new Workbox('/service-worker.js')
      let registration:ServiceWorkerRegistration|undefined
      workbox.register().then((r) => {
        registration = r
      })
      skipWaiting = () => {
        console.debug('skipwaiting called')
        // The user accepted the update, set up a listener
        // that will reload the page as soon as the previously waiting
        // service worker has taken control.
        workbox.addEventListener('controlling', (event) => {
          console.debug('We are controlling the window, lets refresh', event.type)
          window.location.reload()
        })
        if (registration && registration.waiting) {
          console.debug('Sending the message to the worker')
          // Send a message to the waiting service worker,
          // instructing it to activate.
          // Note: for this to work, you have to add a message
          // listener in your service worker. See below.
          messageSW(registration.waiting, { type: 'SKIP_WAITING' })
        }
      }
      workbox.addEventListener('waiting', (event) => {
        console.debug('WorkboxEvent', event)
        pushSnack({ action: skipWaiting, topic: 'update available' })
      })

      // WB debugs
      workbox.addEventListener('message', (event) => { console.debug('WorkboxEvent', event.type) })
      workbox.addEventListener('installed', (event) => { console.debug('WorkboxEvent', event.type) })
      workbox.addEventListener('controlling', (event) => { console.debug('WorkboxEvent', event.type) })
      workbox.addEventListener('activated', (event) => { console.debug('WorkboxEvent', event.type, event.isUpdate) })
      workbox.addEventListener('redundant', (event) => { console.debug('WorkboxEvent', event.type) })
    }
    // *** Workbox/Service worker setup ends ********************************

    return { isAnonymous, ...useI18n(), route, navModel, mekanismi, profileMeta }
  }
})
</script>

<style lang="sass">
@import styles/base.sass

.topLeftFab
  position: fixed
  top: 16px
  left: 16px
  z-index: 10000

@include media('>=tablet')
  #mainContentWrapper
    transition: margin 0.4s ease-in-out
    &.toggle
      margin-left: 310px

</style>
