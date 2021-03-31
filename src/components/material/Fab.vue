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
import { defineComponent, ref } from 'vue'
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
    },
    asyncAction: {
      type: Object.getPrototypeOf(async function () {}).constructor,
      required: false,
      default: undefined
    }
  },
  setup (props) {
    const router = useRouter()

    const buttonClasses = ref({
      working: false
    })

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
    return { clicked }
  }
})
</script>

<style lang="sass">
@import @/styles/box-shadow.sass
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.materialFab
  @include Rise2()
  background-color: var(--chroma-primary-h)
  height: 56px// 3*24=72, 72-2*8=56
  width: 56px
  padding: 0
  border-radius: 28px
  border: none
  background-position: center
  transition: 0.3s
  &.working
    opacity: 0.3
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
    background: var(--chroma-primary-e) radial-gradient(circle, transparent 1%, var(--chroma-primary-e) 1%) center/15000%
    @include Rise3()
  &:active
    background-color: var(--chroma-primary-a)
    background-size: 100%
    transition: background 0s
  &.dark
    background-color: var(--chroma-secondary-b)
    color: white
    &:hover
      background: lighten($color-fill-primary-dark, 2%) radial-gradient(circle, transparent 1%, $color-fill-primary-dark 1%) center/15000%
  &.secondary
    background-color: var(--chroma-alert)
    color: white
    &:hover
      background: var(--chroma-alert) radial-gradient(circle, transparent 1%, var(--chroma-secondary-d) 1%) center/15000%
    &:active
      background-color: var(--chroma-alert)
      background-size: 100%
      transition: background 0s
  &.tertiary
    background-color: var(--chroma-secondary-c)
    color: white
    &:hover
      background: var(--chroma-secondary-d) radial-gradient(circle, transparent 1%, var(--chroma-secondary-a) 1%) center/15000%
    &:active
      background-color: var(--chroma-secondary-d)
      background-size: 100%
      transition: background 0s
  &:disabled
    filter: grayscale(1)
    opacity: 0.7

div#ScreenBottomFloatRight
  button.materialFab + button.materialFab
    margin-left: 8px

.materialFab+.materialFab
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
