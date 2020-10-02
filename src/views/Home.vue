<template>
  <NewPostCard />
  <Stream />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Stream from '@/components/stream/Stream.vue'
import NewPostCard from '@/components/stream/NewPostCard.vue'

export default defineComponent({
  name: 'Home',
  components: {
    Stream,
    NewPostCard
  }
})
</script>
