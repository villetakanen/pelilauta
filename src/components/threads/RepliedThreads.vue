<template>
  <Column class="LatestThreads">
    <h2>{{ $t('threads.replied.title') }}</h2>
    <ThreadListItem
      v-for="thread in replied"
      :key="thread.id"
      :title="thread.title"
      :topic="thread.topic"
    />
  </Column>
</template>

<script lang="ts">
import { useThreads } from '@/state/threads'
import { ThreadClass } from '@/state/threads/threads'
import { defineComponent, onMounted, ref } from 'vue'
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
    const { fetchThreadsWithMostReplies } = useThreads()
    const replied = ref(new Array<ThreadClass>())

    onMounted(() => {
      fetchThreadsWithMostReplies(props.count).then((t) => {
        replied.value = t
      })
    })

    return { replied }
  }
})
</script>
