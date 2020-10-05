<template>
  <h1>{{ pageTitle }}</h1>
  <MaterialFab
    text="New post"
    to="/stream/post"
  >
    <img
      src="@/assets/add.svg"
      alt="new comment"
    >
  </MaterialFab>
  <Stream :topic="topic" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Stream from '@/components/stream/Stream.vue'
import MaterialFab from '@/components/material/MaterialFab.vue'

export default defineComponent({
  name: 'StreamTopic',
  components: {
    Stream,
    MaterialFab
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
