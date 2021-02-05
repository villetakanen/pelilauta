<template>
  <div
    class="appToolbar"
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

<style lang="sass">
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

div.appToolbar
  padding: 0
  padding-left: 8px
  padding-right: 4px
  display: flex
  .spacer
    flex-grow: 1
  h3
    line-height: 48px
</style>
