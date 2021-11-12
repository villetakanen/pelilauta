<template>
  <div
    class="FabTray"
    :class="{ vertical: vertical }"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    vertical: {
      type: Boolean,
      required: false,
      default: false
    }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss

div.FabTray
  display: flex
  flex-direction: column-reverse
  gap: 16px
  align-items: flex-end

@include media('>desktop')
  div.FabTray.vertical
    flex-direction: row-reverse
</style>
