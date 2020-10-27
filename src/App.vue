<template>
  <AppBar />
  <SideNav v-model="navModel" />
  <div
    id="mainContentWrapper"
    :class="{toggle: !navModel}"
  >
    <MaterialBanner />
    <main>
      <WelcomeCard v-if="!isAuthz && route.name !== 'Login'" />
      <router-view v-else />
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
import { defineComponent, onMounted, provide, ref, watch } from 'vue'
import AppBar from './components/AppBar.vue'
import MaterialBanner from './components/material/MaterialBanner.vue'
import MaterialDialog from './components/material/MaterialDialog.vue'
import EditorDialog from '@/components/editor/EditorDialog.vue'
import WelcomeCard from '@/components/app/WelcomeCard.vue'
import SideNav from '@/components/app/SideNav.vue'
import { useAuthz } from './lib/authz'
import { version } from '../package.json'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

export default defineComponent({
  components: {
    AppBar,
    MaterialBanner,
    EditorDialog,
    MaterialDialog,
    WelcomeCard,
    SideNav
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
    const navModel = ref(false)
    const toggleNav = () => {
      console.log('toggleNav')
      navModel.value = !navModel.value
    }
    provide('toggleNav', toggleNav)

    return { isAuthz, missingProfile, version, ...useI18n(), route, navModel }
  }
})
</script>

<style lang="sass">
@import styles/base.sass

main
  padding-top: 62px

@include media('>=tablet')
  #mainContentWrapper
    transition: margin 0.4s ease-in-out
    &.toggle
    //  margin-left: 400px

.footnote
  a
    text-decoration: none
</style>
