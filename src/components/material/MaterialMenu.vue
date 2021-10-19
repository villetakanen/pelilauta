<template>
  <div
    class="material-menu"
    :class="styleClasses"
    tabindex="0"
    @focus="handleFocus"
    @focusout="handleFocusOut"
    @blur="handleFocusOut"
  >
    <img
      class="menu-button"
      src="@/assets/menu-default.svg"
      alt="menu"
    >
    <ul
      class="dropdown"
      :class="dropdownClasses"
    >
      <li
        v-for="item in menuItems"
        :key="item.text"
        :class="{ adminAction: item.admin, withIcon: item.admin || item.icon }"
        @click="item.action"
      >
        <Icon
          v-if="item.admin"
          name="admin"
          inline
        />
        <Icon
          v-if="item.icon && !item.admin"
          :name="item.icon"
          inline
        />
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MenuItem } from '@/utils/uiInterfaces'
import Icon from './Icon.vue'

export default defineComponent({
  components: { Icon },
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
  setup (props) {
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
  padding: 2px
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
      padding: 8px 18px
      cursor: pointer
      white-space: nowrap
      position: relative
      &:hover
        background-color: $color-base-dark
      img
        height: 22px
        vertical-align: middle
        opacity: 0.5
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

.material-menu
  .dropdown
    .withIcon
      padding-left: 8px
    .adminAction
      background-color: var(--chroma-primary-i)
      &:hover
        background-color: var(--chroma-primary-h)

</style>
