<template>
  <button
    class="fab"
    :class="{ hasLabel: text, secondary: secondary, tertiary: tertiary, dark: dark }"
    :disabled="disabled"
    @click="clicked"
  >
    <div
      v-if="text"
      class="label"
    >
      {{ text }}
    </div>
    <Icon
      class="fabIcon"
      :name="icon"
      :dark="tertiary || dark"
    />
  </button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import Icon from './Icon.vue'
export default defineComponent({
  name: 'Fab',
  components: { Icon },
  props: {
    to: {
      type: String,
      required: false,
      default: ''
    },
    icon: {
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
    secondary: {
      type: Boolean,
      required: false,
      default: false
    },
    tertiary: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    dark: {
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

<style lang="sass" scoped>
@import @/styles/box-shadow.sass
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.fab
  @include Rise2()
  height: 56px
  width: 56px
  margin: 0
  padding: 0
  border-radius: 28px
  border: none
  background-position: center
  transition: 0.3s
  line-height: 48px
  .fabIcon
    height: 48px
    width: 48px
    margin: 0 4px
  .label
    @include TypeButton()
    display: none
    line-height: 48px
    margin: 0
    margin-top: 1px //annoying bug somewhere
    padding: 0
    margin-left: 16px
.fab+.fab
  margin-left: 12px
@include media('>phone')
  .fab
    &.hasLabel
      width: auto
      padding-right: 2px
    .label
      display: inline-block

// Color schemes
.fab
  background-color: var(--chroma-primary-h)
  &:hover
    background: var(--chroma-primary-g) radial-gradient(circle, transparent 1%, var(--chroma-primary-g) 1%) center/15000%
    @include Rise3()
  &:active
    background-color: var(--chroma-primary-i)
    background-size: 100%
    transition: background 0s

.fab.secondary
  background-color: var(--chroma-primary-f)
  &:hover
    background: var(--chroma-primary-e) radial-gradient(circle, transparent 1%, var(--chroma-primary-e) 1%) center/15000%
  &:active
    background-color: var(--chroma-primary-g)
    background-size: 100%
    transition: background 0s

.fab.tertiary
  color: var(--chroma-secondary-i)
  background-color: var(--chroma-primary-d)
  &:hover
    background: var(--chroma-primary-c) radial-gradient(circle, transparent 1%, var(--chroma-primary-c) 1%) center/15000%
  &:active
    background-color: var(--chroma-primary-e)
    background-size: 100%
    transition: background 0s

.fab.dark
  color: var(--chroma-secondary-i)
  background-color: var(--chroma-secondary-c)
  &:hover
    background: var(--chroma-secondary-e) radial-gradient(circle, transparent 1%, var(--chroma-secondary-e) 1%) center/15000%
  &:active
    background-color: var(--chroma-secondary-b)
    background-size: 100%
    transition: background 0s

.materialFab
  height: 56px// 3*24=72, 72-2*8=56
  width: 56px
  padding: 0
  &.working
    opacity: 0.3
  &.text
    width: auto
    .label
      display: inline-block
      margin: 4px
      padding-left: 16px
      line-height: 48px
  &:hover
    background: var(--chroma-primary-e) radial-gradient(circle, transparent 1%, var(--chroma-primary-e) 1%) center/15000%
    @include Rise3()
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
