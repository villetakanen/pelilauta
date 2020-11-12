<template>
  <MaterialCard>
    <ThreadCardHeader :thread="thread" />
    <div :innerHTML="thread.data.content" />
    <ThreadCardTailer :thread="thread" />
  </MaterialCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Thread } from '@/state/threads'
import MaterialCard from '@/components/material/MaterialCard.vue'
import ThreadCardHeader from './ThreadCardHeader.vue'

export default defineComponent({
  name: 'ThreadCard',
  components: {
    MaterialCard,
    ThreadCardHeader
  },
  props: {
    thread: {
      type: Object as () => Thread,
      required: true
    }
  }
})
</script>
