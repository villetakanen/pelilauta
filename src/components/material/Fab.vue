<template>
  <button
    class="materialFab"
    :class="{ text: text, secondary: color === 'secondary', tertiary: color === 'tertiary' }"
    :disabled="disabled"
    @click="clicked"
  >
    <div
      v-if="text"
      class="label"
    >
      {{ text }}
    </div>
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'MaterialFab',
  props: {
    to: {
      type: String,
      required: false,
      default: ''
    },
    action: {
      type: Function,
      required: false,
      default: undefined
    },
    text: {
      type: String,
      required: false,
      default: ''
    },
    color: {
      type: String,
      required: false,
      default: ''
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup (props) {
    const router = useRouter()

    function clicked () {
      if (props.to) router.push(props.to)
      else if (props.action) props.action()
    }

    return { clicked }
  }
})
</script>

<style lang="sass">
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.materialFab
  background-color: $color-fill-primary
  height: 56px// 3*24=72, 72-2*8=56
  width: 56px
  padding: 0
  margin: 7ßpx
  border-radius: 28px
  border: none
  background-position: center
  transition: background 0.8s
  &.text
    width: auto
    .label
      @include TypeButton()
      display: inline-block
      margin: 4px
      padding-left: 16px
      line-height: 48px
    img
      margin-right: 8px
  img
    height: 48px
    width: 48px
    vertical-align: middle
    padding-bottom: 4px
  &:hover
    background: lighten($color-fill-primary, 2%) radial-gradient(circle, transparent 1%, $color-fill-primary 1%) center/15000%
  &:active
    background-color: $color-fill-primary-dark
    background-size: 100%
    transition: background 0s
  &.dark
    background-color: $color-fill-primary-dark
    color: white
    &:hover
      background: lighten($color-fill-primary-dark, 2%) radial-gradient(circle, transparent 1%, $color-fill-primary-dark 1%) center/15000%
  &.secondary
    background-color: $color-fill-secondary
    color: white
    &:hover
      background: lighten($color-fill-secondary, 2%) radial-gradient(circle, transparent 1%, $color-fill-primary 1%) center/15000%
  &.tertiary
    background-color: $color-fill-tertiary
    color: white
    &:hover
      background: lighten($color-fill-tertiary, 2%) radial-gradient(circle, transparent 1%, $color-fill-primary 1%) center/15000%
  &:disabled
    filter: grayscale(1)
    opacity: 0.7

div#ScreenBottomFloatRight
  button.materialFab
    @include BoxShadow8()
  button.materialFab + button.materialFab
    margin-left: 8px

@include media('<tablet')
  .materialFab.text
    img
      margin-top: 4px
      margin-left: 4px
      margin-right: 4px
    .label
      display: none
</style>
