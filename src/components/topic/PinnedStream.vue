<template>
  <div class="pinnedStream">
    <ThreadCard
      v-for="thread in pinnedThreads"
      :key="thread.id"
      :thread="thread"
    />
  </div>
</template>

<script lang="ts">
import { useThreads } from '@/state/threads'
import { defineComponent } from 'vue'
import ThreadCard from '../home/ThreadCard.vue'

export default defineComponent({
  components: {
    ThreadCard
  },
  setup () {
    const { pinnedThreads } = useThreads()
    console.debug('pinnedStream', pinnedThreads)
    return { pinnedThreads }
  }
})
</script>
