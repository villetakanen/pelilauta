<template>
  <nav id="sideNav">
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
        <LocaleSwitcher style="position: absolute; bottom: 0px; left: 12px" />
        <transition name="fade">
          <div
            v-if="showExperimentalTools"
            class="warning"
          >
            <p class="TypeBody2">
              {{ $t('experimental.warningText') }}
            </p>
          </div>
        </transition>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { ComputedRef, defineComponent, inject } from 'vue'
import SideNavMenu from '@/components/sidenav/SideNavMenu.vue'
import { useAuth } from '@/state/authz'
import LocaleSwitcher from '../app/LocaleSwitcher.vue'

export default defineComponent({
  name: 'SideNav',
  components: {
    SideNavMenu,
    LocaleSwitcher
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
    const { showExperimentalTools } = useAuth()
    return { toggle, showExperimentalTools }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/box-shadow.sass

#sideNav
  background-color: white
  position: fixed
  z-index: 20000
  #drawer
    @include Rise4()
    position: fixed
    z-index: 10000
    top: 0
    left: 0
    width: 85vw
    height: 100vh
    overflow-y: scroll
    transition: transform 0.3s ease-in-out
    box-sizing: border-box
    padding-right: 24px
    transform: translateX(0)
    background-color: white
    z-index: 1000
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

.menuContainer
  padding-bottom: 48px

@include media('>=tablet')
  #sideNav
    position: relative
    float: left
    z-index: 2
    #drawer
      z-index: 1
      position: relative
      width: 310px
      @include Rise0()
      transition: none
      height: auto
      &.toggled
        transform: translateX(0)
    .overlay
      display: none

.fadeFast-enter-active,
.fadeFast-leave-active
  transition: opacity 0.3s ease

.fadeFast-enter-from,
.fadeFast-leave-to
  opacity: 0
</style>
