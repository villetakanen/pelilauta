<template>
  <NewPostCard :topic="topic" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NewPostCard from '@/components/stream/NewPostCard.vue'

export default defineComponent({
  name: 'StreamPost',
  components: {
    NewPostCard
  },
  props: {
    topic: {
      type: String,
      required: false,
      default: ''
    }
  }
})
</script>
