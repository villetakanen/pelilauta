<template>
  <!-- The top navigation bar: contains search field, menu button, and search button. Maybe profile icon too. -->
  <AppBar />
  <transition name="scaleToFull">
    <div id="identitySplash" v-if="navModel" />
  </transition>
  <SideNav v-model="navModel" />
  <div
    id="mainContentWrapper"
    :class="{toggle: !navModel}"
  >
    <MaterialBanner />
    <main>
      <WelcomeCard v-if="!isAuthz && route.name !== 'Login'" />
      <router-view />
      <div
        style="text-align: center; padding:16px"
        class="footnote"
      >
        <span style="line-height: 56px;opacity:0.37; font-size:12px">Pelilauta</span>
        <img
          style="max-height: 56px; max-width:96px; vertical-align: middle"
          src="@/assets/fox.svg"
        >
        <span style="line-height: 56px;opacity:0.37; font-size:12px">{{ version }} {{ $t('lang') }}</span>
        <div style="text-align: center; padding:16px; line-height: 12px;opacity:0.37; font-size:12px">
          <router-link to="/about">
            {{ $t('app.footnote') }}
          </router-link>
        </div>
        <div style="text-align: center; padding:16px; line-height: 12px;opacity:0.37; font-size:12px">
          <a href="https://github.com/villetakanen/pelilauta">GitHub</a>
        </div>
      </div>
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
import { useAuthz } from './lib/authz'
import { version } from '../package.json'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

export default defineComponent({
  components: {
    MaterialBanner,
    EditorDialog,
    MaterialDialog,
    WelcomeCard,
    SideNav,
    AppBar
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

    return { isAuthz, missingProfile, version, ...useI18n(), route, navModel, onMobile }
  }
})
</script>

<style lang="sass">
@import styles/base.sass

#mainContentWrapper
  margin-top: 56px // app-bar height
  padding-top: 8px
  main
    margin-top: 8px

.topLeftFab
  position: fixed
  top: 16px
  left: 16px
  z-index: 10000

@include media('>=tablet')
  #mainContentWrapper
    transition: margin 0.4s ease-in-out
    main
      max-width: 878px
      margin: 0 auto
    &.toggle
      margin-left: 310px

.footnote
  a
    text-decoration: none

#identitySplash
  height: 74vw
  width: 74vw
  border-radius: 50%
  position: absolute
  background-color: $color-primary
  opacity: 0.22
  z-index:-1
  top: -37vw
  left: -37vw

.scaleToFull-enter-active,
.scaleToFull-leave-active
  transition: transform 0.3s ease

.scaleToFull-enter-from,
.scaleToFull-leave-to
  transform: scale(0)

</style>
