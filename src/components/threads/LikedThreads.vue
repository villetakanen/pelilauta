<template>
  <Column class="LatestThreads">
    <h2>{{ $t('threads.liked.title') }}</h2>
    <ThreadListItem
      v-for="thread in liked"
      :key="thread.id"
      :thread="thread"
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
  name: 'LikedThreads',
  components: { Column, ThreadListItem },
  props: {
    count: {
      type: Number,
      required: false,
      default: 5
    }
  },
  setup (props) {
    const { fetchLikedThreads } = useThreads()
    const liked = ref(new Array<ThreadClass>())

    onMounted(() => {
      fetchLikedThreads(props.count).then((t) => {
        liked.value = t
      })
    })

    return { liked }
  }
})
</script>
