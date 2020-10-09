<template>
  <button
    v-ripple
    :class="buttonClasses"
    @click="clicked"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    text: {
      type: [String, Boolean],
      required: false,
      default: undefined
    },
    action: {
      type: Function,
      required: false,
      default: undefined
    }
  },
  setup (props) {
    const buttonClasses = ref(
      {
        'material-button': true,
        'material-button-text': false
      }
    )
    if (typeof props.text !== 'undefined') buttonClasses.value['material-button-text'] = true

    const clicked = () => {
      if (props.action) props.action()
    }

    return { buttonClasses, clicked }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
@import @/styles/layout.sass

.material-button
  @include TypeButton()
  @include SpacingButton()
  @include ElementColorPrimary()
  @include  BoxShadow3()
  border: none
  position: relative
  overflow: hidden
  transition-property: box-shadow background
  transition-duration: 0.8s
  .materialRippleEffect
    background-color: $color-secondary-light
  &:hover
    @include  BoxShadow8()
    background-color: lighten($color-primary, 5%)
  &.material-button-text
    @include TypeColorPrimary()
    background-color: rgba(0,23,37,0)
    box-shadow: none
    &:hover
      @include  BoxShadow1()
      background-color: rgba(0,23,37,0.1)

.material-button + .material-button
  margin-left: 8px
</style>
