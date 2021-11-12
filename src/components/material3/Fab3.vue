<template>
  <button
    class="Fab"
    :class="{
      small: small,
      secondary: secondary,
      tertiary: tertiary,
      withLabel: label && label.length > 0
    }"
  >
    <Icon
      class="fabIcon"
      :name="icon"
      small
      :dark="secondary || tertiary"
    />
    <span
      v-if="label"
      class="label onlyForDesktop"
    >{{ label }}</span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Icon from '../material/Icon.vue'
export default defineComponent({
  name: 'Fab3',
  components: { Icon },
  props: {
    icon: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: false,
      default: ''
    },
    small: {
      type: Boolean,
      required: false,
      default: false
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
    }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
@import @/styles/box-shadow.sass
@import @/styles/include-media.scss

button.Fab
  @include TypeButton()
  @include Rise2()
  position: relative
  display: block
  flex-grow: 0
  flex-shrink: 0
  border: 0
  height: 56px
  width: 56px
  box-sizing: border-box
  margin: 0
  padding: 12px
  border-radius: 16px
  background-color: var(--chroma-primary-h)
  transition: all 0.3s
  .fabIcon
    position: absolute
    top: 16px
    left: 16px
  &.small
    height: 40px
    width: 40px
    border-radius: 12px
    padding: 8px 12px
    .fabIcon
      position: absolute
      top: 0
      left: 8px
      top: 8px
  &:hover
    background-color: var(--chroma-primary-g)
  &:active
    background-color: var(--chroma-primary-i)
    @include Rise1()
  &.secondary
    color: var(--chroma-secondary-h)
    background-color: var(--chroma-secondary-d)
    &:hover
      background-color: var(--chroma-secondary-c)
    &:active
      background-color: var(--chroma-secondary-e)
  &.tertiary
    background-color: var(--chroma-alert)
    &:hover
      background: linear-gradient(-42deg, var(--chroma-alert) 0%, var(--chroma-primary-i) 100%)
    &:active
      background: linear-gradient(-42deg, var(--chroma-alert) 0%, var(--chroma-secondary-i) 100%)

.FabTray
  .Fab:not(.small)
    margin-top: 8px
@include media('>desktop')
  button.Fab.withLabel
    width: auto
    .label
      padding-left: 40px
      white-space: nowrap
      overflow: hidden
    &.small
      .label
        padding-left: 24px
  div.FabTray.vertical
    .Fab:not(.small)
      margin-top: 0
      margin-left: 8px
</style>
