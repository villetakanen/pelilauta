<template>
  <MaterialCard>
    <ThreadCardHeader :thread="thread" />
    <div :innerHtml="thread.data.content" />
    <ThreadCardTailer :thread="thread" />
  </MaterialCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Thread } from '@/state/threads'
import MaterialCard from '@/components/material/MaterialCard.vue'

export default defineComponent({
  name: 'Threadlist',
  components: {
    MaterialCard
  },
  props: {
    thread: {
      type: Object as () => Thread,
      required: true
    }
  }
})
</script>
