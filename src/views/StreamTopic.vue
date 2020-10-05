<template>
  <h1>{{ pageTitle }}</h1>
  <NewPostCard />
  <Stream :topic="topic" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Stream from '@/components/stream/Stream.vue'
import NewPostCard from '@/components/stream/NewPostCard.vue'

export default defineComponent({
  name: 'StreamTopic',
  components: {
    Stream,
    NewPostCard
  },
  props: {
    topic: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const pageTitle = ref(props.topic.substring(0, 1).toUpperCase() + props.topic.substring(1))
    return { pageTitle }
  }
})
</script>
