<template>
  <Column class="pinnedStream">
    <PinnedThreadCard
      v-for="thread in pinnedThreads"
      :key="thread.id"
      :thread="thread"
    />
  </Column>
</template>

<script lang="ts">
import { useThreads } from '@/state/threads'
import { defineComponent } from 'vue'
import Column from '../layout/Column.vue'
import PinnedThreadCard from './PinnedThreadCard.vue'

export default defineComponent({
  components: {
    PinnedThreadCard,
    Column
  },
  setup () {
    const { pinnedThreads } = useThreads()
    console.debug('pinnedStream', pinnedThreads)
    return { pinnedThreads }
  }
})
</script>

<style lang="sass" scoped>
.pinnedStream
  display: flex
  flex-direction: column
  gap: 8px
  padding: 8px
</style>
