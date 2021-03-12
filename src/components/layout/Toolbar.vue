<template>
  <div
    class="appToolbar toolbar"
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
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

div.appToolbar
  padding: 0
  display: flex
  margin-bottom: 8px
  div:last-child
    margin-right: 0
  h3:first-child
    margin-left: 0
  h3
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

@include media('<tablet')
  div.appToolbar
    height: 48px
</style>
