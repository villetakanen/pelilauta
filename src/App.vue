<template>
  <!-- The top navigation bar: contains search field, menu button, and search button. Maybe profile icon too. -->
  <AppBar />
  <!-- The side navigation drawer, with mobile and desktop modes distinctively -->
  <SideNav v-model="navModel" />
  <div
    id="mainContentWrapper"
    :class="{toggle: !navModel}"
  >
    <MaterialBanner />
    <main>
      <WelcomeCard v-if="!isAuthz && route.name !== 'Login'" />
      <router-view />
      <MainTailer />
    </main>
  </div>
  <teleport to="body">
    <MaterialDialog :visible="missingProfile" />
  </teleport>
  <EditorDialog />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, provide, ref, watch } from 'vue'
import MaterialBanner from './components/material/MaterialBanner.vue'
import MaterialDialog from './components/material/MaterialDialog.vue'
import EditorDialog from '@/components/editor/EditorDialog.vue'
import WelcomeCard from '@/components/app/WelcomeCard.vue'
import SideNav from '@/components/app/SideNav.vue'
import AppBar from '@/components/app/AppBar.vue'
import MainTailer from '@/components/app/MainTailer.vue'
import { useAuthz } from './lib/authz'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

export default defineComponent({
  components: {
    MaterialBanner,
    EditorDialog,
    MaterialDialog,
    WelcomeCard,
    SideNav,
    AppBar,
    MainTailer
  },
  setup () {
    const { missingProfile, lang, isAuthz } = useAuthz()
    const i18n = useI18n()
    const route = useRoute()
    onMounted(() => {
      i18n.locale.value = lang.value
      watch(lang, (l) => { i18n.locale.value = l })
    })

    // Navigation drawer programmatic visibility
    const navModel = ref(window.innerWidth < 768)
    const toggleNav = () => {
      navModel.value = !navModel.value
    }
    provide('navModel', navModel)
    provide('toggleNav', toggleNav)

    const onMobile = computed(() => (window.innerWidth < 768))

    return { isAuthz, missingProfile, ...useI18n(), route, navModel, onMobile }
  }
})
</script>

<style lang="sass">
@import styles/base.sass

#mainContentWrapper
  margin-top: 56px // app-bar height
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
