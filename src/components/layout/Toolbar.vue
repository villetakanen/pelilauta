<template>
  <div
    class="toolbar"
    :class="{ 'theme--dark': dark }"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    dark: {
      type: Boolean,
      required: false,
      default: false
    }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

div.toolbar
  padding: 0 8px
  display: flex
  margin-bottom: 8px
  align-items: flex-start
  div:last-child
    margin-right: 0
  h3:first-child
    margin-left: 0
  h1, h3, h4
    @include TypeHeadline5()
    margin: 0
    padding: 0
    line-height: 48px
    height: 48px
    overflow: hidden
    text-overflow: ellipsis
    max-height: 48px
    word-break: break-all
    color: var(--chroma-secondary-b)
    a
      height: 48px
      color: var(--chroma-secondary-b)
  &.centered
    justify-content: center
    align-items: center

@include media('<tablet')
  div.toolbar
    height: 48px

#dialog
  div.toolbar
    margin: 0
    padding: 0
</style>
