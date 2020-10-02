<template>
  <AppBar/>
  <div id="mainContentWrapper">
    <MaterialBanner/>
    <main>
      <router-view/>
    </main>
  </div>
  <div style="position:fixed; bottom: 16px; right: 16px">{{ version }}</div>
  <MaterialDialog :visible="missingProfile"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppBar from './components/AppBar.vue'
import MaterialDialog from './components/material/MaterialDialog.vue'
import MaterialBanner from './components/material/MaterialBanner.vue'
import { useAuthz } from './lib/authz'
import { version } from '../package.json'

export default defineComponent({
  components: {
    AppBar,
    MaterialBanner,
    MaterialDialog
  },
  setup () {
    const { missingProfile } = useAuthz()
    return { missingProfile, version }
  }
})
</script>

<style lang="sass">
@import styles/base.sass
</style>
