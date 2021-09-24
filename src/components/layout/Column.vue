<template>
  <div
    class="column"
    :class="{theme__dark: dark}"
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
.column
  padding: 16px
  display: block
  background-color: white

.theme__dark.column, .theme__dark .column
  background-color: var(--color-a-a)
</style>
