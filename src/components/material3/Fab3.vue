<template>
  <button
    class="Fab"
    :class="{
      small: small,
      secondary: secondary,
      tertiary: tertiary
    }"
  >
    <Icon
      :class="{ medium: !small}"
      :name="icon"
      :medium="!small"
      :small="small"
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
  flex-grow: 0
  display: block
  @include TypeButton()
  @include Rise2()
  border: 0
  height: 56px
  background-color: var(--chroma-primary-h)
  box-sizing: border-box
  padding: 16px
  border-radius: 16px
  transition: all 0.3s
  .label
    padding: 0 6px
  .icon.medium
    margin: -6px !important
  &.small
    height: 40px
    padding: 8px
    border-radius: 12px
  &:hover
    background-color: var(--chroma-primary-g)
  &:active
    background-color: var(--chroma-primary-i)
    @include Rise1()
  &.secondary
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
  div.FabTray.vertical
    .Fab:not(.small)
      margin-top: 0
      margin-left: 8px
</style>
