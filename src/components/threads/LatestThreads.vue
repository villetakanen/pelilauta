<template>
  <Column class="LatestThreads">
    <h2>{{ $t('threads.latest.title') }}</h2>

    <ThreadListItem
      v-for="thread in latest"
      :key="thread.id"
      :thread="thread"
    />
  </Column>
</template>

<script lang="ts">
import { useThreads } from '@/state/threads'
import { computed, defineComponent } from 'vue'
import Column from '../layout/Column.vue'
import ThreadListItem from './ThreadListItem.vue'

export default defineComponent({
  name: 'TextStyles',
  components: { Column, ThreadListItem },
  props: {
    count: {
      type: Number,
      required: false,
      default: 5
    }
  },
  setup (props) {
    const { latestThreads } = useThreads()
    const latest = computed(() => {
      const a = [...latestThreads.value]
      if (a.length > props.count) a.length = props.count
      return a
    })

    return { latest }
  }
})
</script>
