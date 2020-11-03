<template>
  <div
    class="sideNavAction"
    @click="toggle"
  >
    <transition name="scaleToFull">
      <div
        v-if="toggled"
        class="foxIcon"
      >
        <img
          src="@/assets/fox.svg"
        >
      </div>
      <div
        v-else
        class="closedIcon"
      >
        <img
          src="@/assets/fox.svg"
        >
      </div>
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
  height: 48px
  width: 48px
  position: absolute
  top: 4px
  left:4px
  .foxIcon, .closedIcon
    position: absolute
    top: 0
    left: 0
    margin: 2px
    background-color: $color-fill-primary-light
    border-radius: 50%
    width: 42px
    height: 42px
    box-sizing: border-box
    padding: 2px
  img
    height: 38px
    width: 38px
  .closedIcon
    background: none
    border: solid 5px $color-fill-primary-light
    img
      margin-top: -5px
      margin-left: -5px
      opacity: 0.5

.scaleToFull-enter-active,
.scaleToFull-leave-active
  transition: transform 0.3s ease

.scaleToFull-enter-from,
.scaleToFull-leave-to
  transform: scale(0)

</style>
