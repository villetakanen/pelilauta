<template>
  <div class="errorView">
    <Toolbar>
      <h3>{{ $t('errorPage.notFound') }}</h3>
    </Toolbar>
    <div class="pageAttentionPic" />
  </div>
</template>

<script lang="ts">
import Toolbar from '@/components/layout/Toolbar.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: { Toolbar }
})
</script>

<style lang="sass" scoped>
.errorView
  position: relative
  .pageAttentionPic
    position: fixed
    bottom: 0
    left: 22%
    height: calc(80vh)
    width: calc(33vw)
    background-repeat: no-repeat
    background-position: bottom
    background-image: url('/src/404-element.svg')
</style>
