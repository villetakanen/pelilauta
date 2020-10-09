<template>
  <MaterialCard>
    <h1>{{ pageTitle }}</h1>
  </MaterialCard>
  <teleport to="body">
    <MaterialFab
      v-if="showStreamActions"
      text="New post"
      :to="`/stream/post/${topic}`"
    >
      <img
        src="@/assets/add.svg"
        alt="new comment"
      >
    </MaterialFab>
  </teleport>
  <Stream :topic="topic" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Stream from '@/components/stream/Stream.vue'
import MaterialFab from '@/components/material/MaterialFab.vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import { useMeta } from '@/lib/meta'

export default defineComponent({
  name: 'StreamTopic',
  components: {
    Stream,
    MaterialFab,
    MaterialCard
  },
  props: {
    topic: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const pageTitle = ref(props.topic.substring(0, 1).toUpperCase() + props.topic.substring(1))
    const { showStreamActions } = useMeta()
    return { pageTitle, showStreamActions }
  }
})
</script>
