<template>
  <div id="AppBar">
    <SideNavAction class="topLeftFab"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SideNavAction from '@/components/app/SideNavAction.vue'

export default defineComponent({
  name: 'AppBar',
  components: {
    SideNavAction
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

#AppBar
  position: absolute
  top: 0
  left: 0
  width: 100vw
  height: 56px // 24 x 2 lines
  padding: 4px
  box-sizing: border-box
  border-bottom: solid 1px $color-font-disabled

</style>
