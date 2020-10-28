<template>
  <div
    class="sideNavAction"
    @click="toggle"
  >
    <transition name="scaleToFull">
      <img
        v-if="toggled"
        src="@/assets/icons/action-menu-closed.svg"
      >
      <img
        v-else
        src="@/assets/icons/action-menu-open.svg"
      >
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, Ref } from 'vue'

export default defineComponent({
  name: 'SideNavAction',
  setup () {
    const toggle = inject('toggleNav') as CallableFunction
    const toggled = inject('navModel') as Ref
    return { toggle, toggled }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.sideNavAction
  height: 44px
  width: 44px
  margin:6px
  position: relative
  img
    position: absolute
    top: 0
    left: 0

.scaleToFull-enter-active,
.scaleToFull-leave-active
  transition: transform 0.3s ease

.scaleToFull-enter-from,
.scaleToFull-leave-to
  transform: scale(0)

</style>
