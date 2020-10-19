<template>
  <AppBar />
  <div id="mainContentWrapper">
    <MaterialBanner />
    <main>
      <router-view />
      <div style="text-align: center; padding:16px" class="footnote">
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
          <a href="https://https://github.com/villetakanen/pelilauta">GitHub</a>
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
import { defineComponent, onMounted, watch } from 'vue'
import AppBar from './components/AppBar.vue'
import MaterialBanner from './components/material/MaterialBanner.vue'
import MaterialDialog from './components/material/MaterialDialog.vue'
import EditorDialog from '@/components/editor/EditorDialog.vue'
import { useAuthz } from './lib/authz'
import { version } from '../package.json'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: {
    AppBar,
    MaterialBanner,
    EditorDialog,
    MaterialDialog
  },
  setup () {
    const { missingProfile, lang } = useAuthz()
    const i18n = useI18n()
    onMounted(() => {
      i18n.locale.value = lang.value
      watch(lang, (l) => { i18n.locale.value = l })
    })
    return { missingProfile, version, ...useI18n() }
  }
})
</script>

<style lang="sass">
@import styles/base.sass

main
  padding-top: 62px

.footnote
  a
    text-decoration: none
</style>
