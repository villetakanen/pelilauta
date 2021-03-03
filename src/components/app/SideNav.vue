<template>
  <transition name="fadeFast">
    <div
      v-if="!modelValue"
      class="overlay"
      @click="toggle"
    />
  </transition>
  <div
    id="sideNav"
    :class="{ toggled: modelValue }"
  >
    <div class="menuContainer">
      <SideNavMenu />
      <SiteInfo />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import SideNavMenu from '@/components/app/SideNavMenu.vue'
import SiteInfo from '@/components/app/SiteInfo.vue'
import { useAuthState } from '@/state/authz'

export default defineComponent({
  name: 'SideNav',
  components: {
    SiteInfo,
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
    const toggle = () => {
      if (window.innerWidth < 768) toggleNav()
    }
    return { toggle }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

#sideNav
  position: absolute
  z-index: 900
  top: 0
  left: 0
  width: 310px
  height: 100vh
  transition: transform 0.3s ease-in-out
  overflow: hidden
  overflow-y: scroll

@include media('>=tablet')
  #sideNav
    &.toggled
      transform: translateX(-400px)
    .back
      display: none

@include media('<tablet')
  #sideNav
    position: fixed
    @include BoxShadow24()
    background-color: $color-base
    width: 84vw
    z-index: 20000
    transform: translateX(0px)
    .menuContainer
      margin-top: 0px
    &.toggled
      transform: translateX(-100vw)
  .overlay
     position: fixed
     top: 0
     left: 0
     height: 100vh
     width: 100vw
     background-color: $color-fill-primary-dark
     opacity: 0.37
     z-index: 999
     &.toggled
       display: none

#nav-screen-overlay
  display: block
  position: fixed
  top: 0
  left: 0
  margin: 0
  padding: 0
  z-index: 2
  height: 100vh
  width: 100vw
  background-color: $color-fill-primary-dark
  opacity: 0
  cursor: default
  pointer-events: none
  transition: opacity 0.5s ease-in-out

.fadeFast-enter-active,
.fadeFast-leave-active
  transition: opacity 0.3s ease

.fadeFast-enter-from,
.fadeFast-leave-to
  opacity: 0
</style>
