<template>
  <AppBar/>
  <div id="mainContentWrapper">
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppBar from './components/AppBar.vue'

export default defineComponent({
  components: {
    AppBar
  }
})
</script>

<style lang="sass">
@import styles/base.sass
</style>
