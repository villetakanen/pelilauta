<template>
  <div class="menu-action">
    <a
      href="#sidebar-nav"
      target="_self"
    >
      <img src="@/assets/icons/menu-burger.svg">
    </a>
  </div>
  <div
    id="sidebar-nav"
    class="menu"
  >
    <div class="menu-header">
      <MaterialButton
        :action="close"
        icon
        text
        class="back"
      >
        <img src="@/assets/action-back.svg">
      </MaterialButton>
      <div class="avatar">
        <img src="@/assets/fox.svg">
      </div>
    </div>
    <div class="menu-container">
      <ul>
        <li>
          <img src="@/assets/d20.svg"> Home
        </li>
      </ul>
    </div>
  </div>
  <a
    id="nav-screen-overlay"
    href="#"
    target="_self"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import MaterialCard from '@/components/material/MaterialCard.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'

export default defineComponent({
  name: 'SideNav',
  components: {
    // MaterialCard,
    MaterialButton
  },
  setup () {
    function close () {
      window.location.hash = '#'
    }
    return { close }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.menu-action
  height: 56px
  padding: 8px 0
  a
    margin: 0
    padding: 0
  img
    height: 40px
    width: 40px
    &:active
     transform: scale(.95)
#sidebar-nav
  position: absolute
  z-index: 3
  top: 0
  left: 0
  height: 100vh
  width: 400px
  transform: translateX(-400px)
  transition: transform 0.3s ease-in-out
  background-color: $color-base
  .menu-header
    background-color: $color-primary-light
    padding: 8px
    .back
      float: right
    .avatar
      border-radius: 48px
      height: 96px
      width: 96px
      background-color: $color-primary-dark
      img
        height: 82px
        width: 82px
        margin: 8px
  .menu-container
    padding: 8px
    ul
      margin: 0
      padding: 0
    li
      @include TypeButton()
      list-style-type: none
      margin: 0
      padding: 0
      height: 48px
      color: $color-font-medium
      &:hover
        background-color: $color-base-darker
      img
        height: 40px
        vertical-align: middle

  &:target
    transform: translateX(0px)
    // box-shadow: (-4px) 0 12px 6px shadow
    + #nav-screen-overlay
      display: block
      pointer-events: auto
      opacity: 0.3

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
  background-color: $color-primary-dark
  opacity: 0
  cursor: default
  pointer-events: none
  transition: opacity 0.5s ease-in-out
</style>
