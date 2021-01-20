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
        <WelcomeCard v-if="!isAuthz && route.name !== 'Login'" />
        <router-view />
        <MainTailer />
      </main>
    </div>
  </div>
  <teleport to="body">
    <MaterialDialog :visible="missingProfile" />
  </teleport>
  <SnackBar />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, provide, ref, watch } from 'vue'
import MaterialDialog from './components/material/MaterialDialog.vue'
import WelcomeCard from '@/components/app/WelcomeCard.vue'
import SideNav from '@/components/app/SideNav.vue'
import AppBar from '@/components/app/AppBar.vue'
// import MekanismiBar from '@/components/app/MekanismiBar.vue'
import MainTailer from '@/components/app/MainTailer.vue'
import { useAuthz } from './lib/authz'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useSnack } from '@/composables/useSnack'
import SnackBar from './components/app/SnackBar.vue'
import { register } from 'register-service-worker'

export default defineComponent({
  components: {
    MaterialDialog,
    WelcomeCard,
    SideNav,
    AppBar,
    MainTailer,
    SnackBar// ,
    // MekanismiBar
  },
  setup () {
    const { missingProfile, lang, isAuthz } = useAuthz()
    const i18n = useI18n()
    const route = useRoute()
    onMounted(() => {
      i18n.locale.value = lang.value
      watch(lang, (l) => { i18n.locale.value = l })
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

    // ************************************************************************
    // * SETUP WORKBOX/SPA AND THE UPDATE BUTTON HERE                         *
    // ************************************************************************
    let swr: ServiceWorkerRegistration|undefined

    register('/service-worker.js', {
      registrationOptions: { scope: './' },
      ready (registration) {
        console.log('Service worker is active.', registration)
      },
      registered (registration) {
        console.log('Service worker has been registered.')
        setInterval(() => {
          registration.update()
        }, 60 * 1000 * 5) // 1000 * 60) // minute checks for testing * 60) // e.g. hourly checks
      },
      cached (registration) {
        console.log('Content has been cached for offline use.', registration)
      },
      updatefound (registration) {
        console.log('New content is downloading.', registration)
      },
      updated (registration: ServiceWorkerRegistration) {
        console.log('New content is available; please refresh.')
        pushSnack({
          topic: i18n.t('app.title'),
          message: i18n.t('app.updatesAvailable'),
          action: acceptUpdate,
          actionMessage: i18n.t('actions.update')
        })
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

    const mekanismi = computed(() => ((route.name || '').toString().split('.')[0] === 'mekanismi'))

    return { isAuthz, missingProfile, ...useI18n(), route, navModel, mekanismi }
  }
})
</script>

<style lang="sass">
@import styles/base.sass

#mainContentWrapper
  // margin-top: 56px // app-bar height
  // background-color: rgba(0,0,0,0.04)

.topLeftFab
  position: fixed
  top: 16px
  left: 16px
  z-index: 10000

@include media('>=tablet')
  #mainContentWrapper
    transition: margin 0.4s ease-in-out
    main
      padding: 16px
    &.toggle
      margin-left: 310px

</style>
