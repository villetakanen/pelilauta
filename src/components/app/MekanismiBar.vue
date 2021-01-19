<template>
  <div id="mekanismiBar">
    <router-link to="/mekanismi"> site.name </router-link>&nbsp;/&nbsp;<router-link to="/mekanismi"> page.name </router-link>
  </div>
  <div id="mekanismiBarSpacer" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    /* const site = inject('site') as Site
    const page = inject('page') as Page
    return { site, page } */
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

#mekanismiBar
  @include TypeCaption()
  position: absolute
  left: 0
  top: 56px
  height: 22px
  background-color: $color-fill-tertiary
  width: calc(100vw - 32px)
  padding: 2px 16px
  line-height: 22px
  display: flex
  color: #ccc
  a
    color: white
    text-decoration: none
#mekanismiBarSpacer
  height: 20px
</style>
