<template>
  <!-- The top navigation bar: contains search field, menu button, and search button. Maybe profile icon too. -->
  <AppBar />
  <div id="AppBarSubmenu" />
  <!-- The side navigation drawer, with mobile and desktop modes distinctively -->
  <FrozenBar v-if="frozen" />

  <!-- App Content wrapper -->
  <div id="appContent">
    <SideNav v-model="navModel" />
    <main>
      <router-view />
    </main>
  </div>
  <MainTailer />

  <!-- Fixed floating components -->
  <BottomFloatContainer>
    <template #left>
      <SnackBar />
    </template>
    <template #right>
      <div id="BottomFabsContainer" />
    </template>
  </BottomFloatContainer>

  <!-- App level dialogs -->
  <CompleteRegistrationDialog />
</template>

<script lang="ts">
import { computed, defineComponent, provide, ref } from 'vue'
import SideNav from '@/components/sidenav/SideNav.vue'
import AppBar from '@/components/app/AppBar.vue'
import MainTailer from '@/components/app/MainTailer.vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useSnack } from '@/composables/useSnack'
import SnackBar from './components/app/SnackBar.vue'
import BottomFloatContainer from './components/material/BottomFloatContainer.vue'
import { useAuth, useProfile } from './state/authz'
import { Workbox } from 'workbox-window'
import CompleteRegistrationDialog from './components/auth/CompleteRegistrationDialog.vue'
import FrozenBar from '@/components/app/FrozenBar.vue'

export default defineComponent({
  components: {
    SideNav,
    AppBar,
    MainTailer,
    SnackBar,
    BottomFloatContainer,
    CompleteRegistrationDialog,
    FrozenBar
  },
  setup () {
    const { frozen } = useAuth()
    const { profileMeta } = useProfile()
    const i18n = useI18n()
    const route = useRoute()

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

    return { ...useI18n(), route, navModel, mekanismi, profileMeta, frozen }
  }
})
</script>

<style lang="sass">
@import styles/base.sass

#appContent
  display: flex
  background-color: white
  padding-bottom: 24px
  main
    width: calc(100vw - 310px)
    flex-shrink: 0
    margin: 0
    min-height: 800px

@include media('<tablet')
  #appContent
    display: block
    main
      width: 100vw
</style>
