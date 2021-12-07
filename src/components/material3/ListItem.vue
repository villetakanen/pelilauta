<template>
  <div class="ListItem">
    <div class="ListItem-content">
      <slot />
    </div>
    <SpacerDiv />
    <div class="ListItem-action">
      <slot name="action" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SpacerDiv from '../layout/SpacerDiv.vue'

export default defineComponent({
  components: { SpacerDiv }
})
</script>

<style lang="sass" scoped>
div.ListItem
  display: flex
  box-sizing: border-box
  padding: 12px 16px
  line-height: 24px
  .ListItem-content
    line-height: 24px
    padding-top: 12px
div.ListItem+div.ListItem
  padding-top: 11px
  border-top: 1px solid var(--chroma-secondary-h)
</style>
