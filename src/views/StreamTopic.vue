<template>
  <MaterialCard>
    <h1>{{ pageTitle }}</h1>
  </MaterialCard>
  <NewPostCard />
  <Stream :topic="topic"/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import Stream from '@/components/stream/Stream.vue'
import NewPostCard from '@/components/stream/NewPostCard.vue'

export default defineComponent({
  name: 'StreamTopic',
  props: {
    topic: {
      type: String,
      required: true
    }
  },
  components: {
    MaterialCard,
    Stream,
    NewPostCard
  },
  setup (props) {
    const pageTitle = ref(props.topic.substring(0, 1).toUpperCase() + props.topic.substring(1))
    return { pageTitle }
  }
})
</script>
