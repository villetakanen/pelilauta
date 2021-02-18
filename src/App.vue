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
import { Workbox } from 'workbox-window'

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
      const workbox = new Workbox('/service-worker.js')

      skipWaiting = () => {
        console.debug('App.js skipwaiting called')
        workbox.addEventListener('controlling', (event) => {
          console.debug('controlling', event)
          window.location.reload()
        })
        workbox.messageSkipWaiting()
      }

      workbox.addEventListener('waiting', (event) => {
        console.debug('WorkboxEvent', event.type)
        pushSnack({ action: skipWaiting, topic: i18n.t('app.updatesAvailable'), actionMessage: i18n.t('action.update') })
      })

      // WB debugs
      workbox.addEventListener('message', (event) => { console.debug('WorkboxEvent', event) })
      workbox.addEventListener('installed', (event) => { console.debug('WorkboxEvent', event) })
      workbox.addEventListener('controlling', (event) => { console.debug('WorkboxEvent', event) })
      workbox.addEventListener('activated', (event) => { console.debug('WorkboxEvent', event) })
      workbox.addEventListener('redundant', (event) => { console.debug('WorkboxEvent', event) })

      workbox.register()
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
