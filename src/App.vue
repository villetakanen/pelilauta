<template>
  <AppBar />
  <div id="mainContentWrapper">
    <MaterialBanner />
    <main>
      <router-view />
      <div style="text-align: center; padding-bottom:16px">
        <span style="line-height: 56px;opacity:0.37; font-size:12px">Pelilauta</span>
        <img
          style="max-height: 56px; max-width:96px; vertical-align: middle"
          src="@/assets/fox.svg"
        >
        <span style="line-height: 56px;opacity:0.37; font-size:12px">{{ version }} {{ $t('lang') }}</span>
      </div>
    </main>
  </div>
  <MaterialDialog :visible="missingProfile" />
  <EditorDialog />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppBar from './components/AppBar.vue'
import MaterialDialog from './components/material/MaterialDialog.vue'
import MaterialBanner from './components/material/MaterialBanner.vue'
import EditorDialog from '@/components/editor/EditorDialog.vue'
import { useAuthz } from './lib/authz'
import { version } from '../package.json'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: {
    AppBar,
    MaterialBanner,
    MaterialDialog,
    EditorDialog
  },
  setup () {
    const { missingProfile } = useAuthz()
    return { missingProfile, version, ...useI18n() }
  }
})
</script>

<style lang="sass">
@import styles/base.sass

main
  padding-top: 62px
</style>
