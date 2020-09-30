<template>
  <AppBar/>
  <router-view/>
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
