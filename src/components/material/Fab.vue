<template>
  <button
    class="materialFab"
    :class="{ text: text, secondary: color === 'secondary' }"
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
  // border: solid 1px #00233722
  // box-shadow: 0px 0px 4px 0px rgba(0,35,55,0.11)
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
  &.secondary
    background-color: $color-fill-secondary
    color: white
    &:hover
      background: lighten($color-fill-secondary, 2%) radial-gradient(circle, transparent 1%, $color-fill-primary 1%) center/15000%
</style>
