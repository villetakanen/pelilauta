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
@import @/styles/material-typography.sass
@import @/styles/layout.sass
@import @/styles/box-shadow.sass

.sideNavAction
  @include SpacingIcon2()
  @include Halo8()
  position: relative
  background: linear-gradient(-45deg, var(--chroma-primary-g) 0%, var(--chroma-primary-a) 100%)
  .foxIcon, .closedIcon
    @include SpacingIcon2()
    position: absolute
    margin: 0
    top: 0
    left: 0
    box-sizing: border-box
    z-index: 10001
  img
    @include SpacingIcon2()
    margin: 0

.scaleToFull-enter-active,
.scaleToFull-leave-active
  transition: transform 0.3s ease

.scaleToFull-enter-from,
.scaleToFull-leave-to
  transform: scale(0)

</style>
