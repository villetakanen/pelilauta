<template>
  <div class="errorView">
    <div class="pageAttentionPic" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
})
</script>

<style lang="sass" scoped>
.errorView
  min-height: calc(100vh - 64px)
  position: relative
  .pageAttentionPic
    position: fixed
    bottom: 0
    left: 33%
    height: calc(80vh)
    width: calc(22vw)
    background-repeat: no-repeat
    background-position: bottom
    background-image: url('/src/404-element.svg')
</style>
