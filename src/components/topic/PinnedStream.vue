<template>
  <div class="pinnedStream">
    <PinnedThreadCard
      v-for="thread in pinnedThreads"
      :key="thread.id"
      :thread="thread"
    />
  </div>
</template>

<script lang="ts">
import { useThreads } from '@/state/threads'
import { defineComponent } from 'vue'
import PinnedThreadCard from './PinnedThreadCard.vue'

export default defineComponent({
  components: {
    PinnedThreadCard
  },
  setup () {
    const { pinnedThreads } = useThreads()
    console.debug('pinnedStream', pinnedThreads)
    return { pinnedThreads }
  }
})
</script>
