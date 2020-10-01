<template>
  <AppBar/>
  <div id="mainContentWrapper">
    <main>
      <router-view/>
    </main>
  </div>
  <MaterialDialog :visible="missingProfile"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppBar from './components/AppBar.vue'
import MaterialDialog from './components/material/MaterialDialog.vue'
import { useAuthz } from './lib/authz'

export default defineComponent({
  components: {
    AppBar,
    MaterialDialog
  },
  setup () {
    const { missingProfile } = useAuthz()
    return { missingProfile }
  }
})
</script>

<style lang="sass">
@import styles/base.sass
</style>
