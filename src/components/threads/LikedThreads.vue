<template>
  <Column class="LatestThreads">
    <h2>{{ $t('threads.liked.title') }}</h2>
    <p
      v-for="thread in liked"
      :key="thread.id"
    >
      {{ thread.title }}
    </p>
  </Column>
</template>

<script lang="ts">
import { useThreads } from '@/state/threads'
import { defineComponent } from 'vue'
import Column from '../layout/Column.vue'

export default defineComponent({
  name: 'LikedThreads',
  components: { Column },
  props: {
    count: {
      type: Number,
      required: false,
      default: 5
    }
  },
  setup (props) {
    const { fetchLikedThreads } = useThreads()
    const liked = fetchLikedThreads(props.count)
    return { liked }
  }
})
</script>
