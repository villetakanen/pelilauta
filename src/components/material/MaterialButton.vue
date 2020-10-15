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
      type: Boolean,
      required: false,
      default: false
    },
    action: {
      type: Function,
      required: false,
      default: undefined
    },
    icon: {
      type: Boolean,
      required: false,
      default: false
    },
    color: {
      type: String,
      required: false,
      default: ''
    },
    dark: {
      type: Boolean,
      required: false,
      default: false
    },
    block: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup (props) {
    const buttonClasses = ref(
      {
        'material-button': true,
        'material-button-text': props.text,
        'colortheme-secondary': false,
        'material-button-icon': props.icon,
        'theme--dark': props.dark,
        'block-button': props.block
      }
    )
    // if (typeof props.text !== 'undefined') buttonClasses.value['material-button-text'] = true
    if (props.color === 'secondary') buttonClasses.value['colortheme-secondary'] = true

    const clicked = () => {
      if (props.action) props.action()
    }

    return { buttonClasses, clicked }
  }
})
</script>

<style lang="sass">
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
@import @/styles/layout.sass
@import @/styles/include-media.scss

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
      background-color: rgba(0,23,37,0.1)

  &.material-button-icon
    height: 48px
    width: 48px
    padding: 6px
    border-radius: 24px
    img
      max-height: 36px
      max-width: 36px
      margin: 0

  &.colortheme-secondary
   @include ElementColorSecondary()

.material-button + .material-button
  margin-left: 8px

.material-button.theme--dark
  background-color: $color-theme--dark-base
  color: $color-theme--dark-front
  &:hover
    background-color: $color-theme--dark-base-hover
  &.material-button-text
    background: none
    color: $color-theme--dark-base
    &:hover
      background-color: $color-theme--dark-base-11

@include media('<tablet')
  .material-button.block-button
    display: block
    box-sizing: border-box
    width: 100%
    clear: both
    margin: 0 auto
</style>
