<template>
  <div
    class="hamburgerMenuButton"
    :class="{ toggled: toggled}"
    @click="toggle"
  >
    <div class="interacts">
      <div class="bar" />
      <div class="bar" />
      <div class="bar" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'HamburgerMenuButton',
  props: {
    modelValue: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const toggled = ref(props.modelValue)
    function toggle () {
      toggled.value = !toggled.value
      context.emit('update:modelValue', toggled.value)
    }
    return { toggled, toggle }
  }
})
</script>

<style lang="sass" scoped>
.hamburgerMenuButton
  background-color: var(--color-e-h)
  width: 36px
  height: 36px
  padding: 6px
  position: relative
  border-radius: 24px
  .interacts
    width: 36px
    height: 36px
    position: relative
  .bar
    position: absolute
    width: 30px
    height: 4px
    border-radius: 2px
    left: 3px
    background-color: var(--color-b-b)
    transition: all 200ms
    &:first-of-type
      top: 6px
    &:nth-of-type(2)
      top: 16px
    &:nth-of-type(3)
      top: 26px
  &.toggled
    .bar
      &:first-of-type
        top: 16px
        transform: rotate(45deg)
        background-color: var(--color-a-a)
      &:nth-of-type(2)
        top: 16px
        left: -32px
        opacity: 0
        background-color: var(--color-d-a)
      &:nth-of-type(3)
        top: 16px
        transform: rotate(-45deg)
        background-color: var(--color-a-a)

.toolbar
  .hamburgerMenuButton
    flex-grow: 0
    margin: 0
</style>
