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
@import @/styles/box-shadow.sass
@import @/styles/include-media.scss

@keyframes clickhover
  0%
    transform: scale(1)
  50%
    transform: scale(0.9)
  100%
    transform: scale(1)

.material-button
  @include TypeButton()
  @include Rise2()
  height: 32px
  padding: 4px 16px
  margin: 4px
  border: none
  position: relative
  overflow: hidden
  transition-property: box-shadow background
  transition-duration: 0.8s
  background-color: var(--chroma-primary-e)
  color: $color-dark-font-high
  &:hover
    background-color: var(--chroma-primary-g)
    @include Rise3()
    &.theme--dark
      background-color: $color-fill-primary-dark
  &:active
    animation: clickhover 300ms
  &.working
    opacity: 0.5
    pointer-events: none
  // Text
  &.material-button-text
    color: var(--chroma-primary-d)
    background-color: rgba(0,0,0,0)
    box-shadow: none
    &:hover
      color: var(--chroma-primary-a)
      background-color: #{'rgba(var(--chroma-primary-g-rgba), 0.22)'}
  // Dark
  &.theme--dark
    color: var(--chroma-secondary-i)
    background-color: var(--chroma-secondary-c)
    &:hover
      background-color: var(--chroma-secondary-d)
  // Dark Text
  &.material-button-text.theme--dark
    color: var(--chroma-primary-g)
    background-color: rgba(0,0,0,0)
    box-shadow: none
    &:hover
      color: var(--chroma-primary-h)
      background-color: #{'rgba(var(--chroma-primary-g-rgba), 0.11)'}
  &.material-button-icon
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
    flex-shrink: 0
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

@include media('<tablet')
  .material-button.block-button
    display: block
    box-sizing: border-box
    width: 100%
    clear: both
    margin: 0 auto
</style>
