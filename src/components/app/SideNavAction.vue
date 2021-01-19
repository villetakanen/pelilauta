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
          alt="Pelilauta logo"
        >
      </div>
      <div
        v-else
        class="closedIcon"
      >
        <img
          src="@/assets/fox.svg"
          alt="Pelilauta logo"
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
  position: fixed
  top: 4px
  left: 4px
  background-color: $color-fill-primary-dark
  border-radius: 24px
  z-index: 10000
  .foxIcon, .closedIcon
    position: absolute
    top: 0
    left: 0
    margin: 3px
    border: solid 5px rgba($color-fill-light, 0.44)
    border-radius: 50%
    width: 42px
    height: 42px
    box-sizing: border-box
    padding: 2px
  img
    height: 38px
    width: 38px
    margin-top: -5px
    margin-left: -5px
  .closedIcon
    background: none
    border: solid 5px rgba($color-fill-light, 0.44)
    img
      margin-top: -5px
      margin-left: -5px

.scaleToFull-enter-active,
.scaleToFull-leave-active
  transition: transform 0.3s ease

.scaleToFull-enter-from,
.scaleToFull-leave-to
  transform: scale(0)

</style>
