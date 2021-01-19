<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    @click="clicked"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

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
    asyncAction: {
      type: Object.getPrototypeOf(async function () {}).constructor,
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
    },
    to: {
      type: String,
      required: false,
      default: undefined
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    inline: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup (props) {
    const router = useRouter()
    const buttonClasses = ref(
      {
        'material-button': true,
        'material-button-text': props.text,
        'colortheme-secondary': false,
        'colortheme-tertiary': false,
        'material-button-icon': props.icon,
        'theme--dark': props.dark,
        'block-button': props.block,
        working: false,
        inline: props.inline
      }
    )
    // if (typeof props.text !== 'undefined') buttonClasses.value['material-button-text'] = true
    if (props.color === 'secondary') buttonClasses.value['colortheme-secondary'] = true
    else if (props.color === 'tertiary') buttonClasses.value['colortheme-tertiary'] = true

    const clicked = () => {
      if (props.action) {
        props.action()
      } else if (props.asyncAction) {
        buttonClasses.value.working = true
        props.asyncAction().then(() => {
          buttonClasses.value.working = false
        })
      } else if (props.to) router.push(props.to)
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
  @include  BoxShadow3()
  height: 36px
  padding: 6px 16px
  border: none
  position: relative
  overflow: hidden
  transition-property: box-shadow background
  transition-duration: 0.8s
  background-color: $color-fill-primary-dark
  color: $color-dark-font-high
  &.working
    opacity: 0.5
    pointer-events: none
  &:hover
    background-color: $color-fill-primary
    &.theme--dark
      background-color: $color-fill-primary-dark
  &.material-button-text, &.material-button-icon
    color: $color-fill-primary-dark
    background-color: #00233711
    box-shadow: none
    &:hover
      background-color: #00233737
  img
    max-height: 22px
    vertical-align: middle
    margin-left: -4px
    margin-right: 4px

  &.material-button-icon
    height: 48px
    width: 48px
    padding: 6px
    border-radius: 24px
    img
      max-height: 36px
      max-width: 36px
      margin: 0
    &.inline
      height: 28px
      width: 28px
      padding: 0
      margin: -2px 0
      img
        max-height: 28px
      max-width: 28px
  &.colortheme-secondary
    @include ElementColorSecondary()
  &.colortheme-tertiary
    background-color: $color-fill-tertiary
    color: white
  &:disabled
    opacity: 0.7
    background-color: #00233744

.material-button + .material-button
  margin-left: 8px

.material-button.theme--dark
  background-color: $color-fill-dark
  color: $color-fill-light
  &:hover
    background-color: $color-fill-primary-dark
  &.material-button-text
    background: none
    color: white
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
