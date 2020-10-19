<template>
  <div
    class="material-menu"
    :class="styleClasses"
    @focus="handleFocus"
    @focusout="handleFocusOut"
    @blur="handleFocusOut"
    tabindex="0"
  >
    <img
      class="menu-button"
      src="@/assets/menu-default.svg"
    >
    <ul class="dropdown" :class="dropdownClasses">
      <li
        v-for="item in menuItems"
        :key="item.text"
        @click="item.action"
      >
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MenuItem } from '@/lib/stream'

export default defineComponent({
  props: {
    modelValue: {
      type: Array,
      required: false,
      default: undefined
    },
    small: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup (props, context) {
    const router = useRouter()

    const menuItems = computed(() => {
      const arr = new Array<MenuItem>()
      if (props.modelValue) {
        props.modelValue.forEach((item) => {
          const menuItem: MenuItem = (item as unknown) as MenuItem
          if (menuItem && menuItem.text) {
            if (menuItem.to) {
              menuItem.action = () => { router.push(menuItem.to + '') }
            } else if (!menuItem.action) {
              menuItem.action = () => {}
            }
            arr.push(menuItem)
          }
        })
      }
      return arr
    })

    const styleClasses = computed(() => {
      const arr = new Array<string>()
      if (props.small) arr.push('small-icons')
      if (!props.modelValue || props.modelValue.length < 1) arr.push('disabled')
      return arr
    })

    const dropdownClasses = ref('')

    const handleFocus = () => {
      dropdownClasses.value = 'visible'
    }
    const handleFocusOut = () => {
      dropdownClasses.value = ''
    }

    return { menuItems, styleClasses, handleFocusOut, handleFocus, dropdownClasses }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass

.material-menu
  position: relative
  margin: 0
  padding: 0
  height: 44px
  .dropdown
    @include BoxShadow3()
    position: absolute
    right: 0
    top: 44px
    z-index: 1000
    margin: 0
    padding: 0
    background-color: white
    transition: all 0.3s ease
    transform: scale(0)
    transform-origin: 100% 0
    li
      display: block
      padding: 1em 18px
      cursor: pointer
      white-space: nowrap
      &:hover
        background-color: $color-base-dark
  &:hover
    background-color: $color-base-dark
  .dropdown.visible
      transform: scale(1)
  &.small-icons
    height: 16px
    width: 16px
    padding: 4px
    .dropdown
      top: 24px
    .menu-button
      height: 16px
      width: 16px
      padding: 0

.menu-button
  height: 22px
  width: 22px
  padding: 11px

.disabled
  opacity: 0.2

</style>
