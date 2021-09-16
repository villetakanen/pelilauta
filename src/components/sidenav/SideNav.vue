<template>
  <div id="sideNav">
    <transition name="fadeFast">
      <div
        v-if="!modelValue"
        class="overlay"
        @click="toggle"
      />
    </transition>
    <div
      id="drawer"
      :class="{ toggled: modelValue }"
    >
      <div class="menuContainer">
        <SideNavMenu />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ComputedRef, defineComponent, inject } from 'vue'
import SideNavMenu from '@/components/sidenav/SideNavMenu.vue'

export default defineComponent({
  name: 'SideNav',
  components: {
    SideNavMenu
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  setup () {
    const toggleNav: CallableFunction = inject('toggleNav') as CallableFunction
    const mobile = inject('mobileViewport') as ComputedRef<boolean>
    const toggle = () => {
      if (mobile.value) toggleNav()
    }
    return { toggle }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss

#sideNav
  position: relative
  #drawer
    width: 310px

@include media('>=tablet')
  #sideNav
    .back
      display: none

@include media('<tablet')
  #sideNav
    position: fixed
    z-index: 20000
    top: 0
    left: 0
    background-color: white
    #drawer
      transition: transform 0.3s ease-in-out
      width: 85vw
      box-sizing: border-box
      padding-right: 24px
      position: fixed
      z-index: 10000
      top: 0
      left: 0
      transform: translateX(0)
      background-color: white
      box-shadow: 0 0 15vw 0 var(--color-a-a)
      &.toggled
        transform: translateX(-100vw)
    .overlay
      position: fixed
      top: 0
      left: 0
      height: 100vh
      width: 100vw
      background-color: var(--color-b-c)
      opacity: 0.37
      z-index: 999

.fadeFast-enter-active,
.fadeFast-leave-active
  transition: opacity 0.3s ease

.fadeFast-enter-from,
.fadeFast-leave-to
  opacity: 0
</style>
