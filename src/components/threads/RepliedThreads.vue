<template>
  <Column class="LatestThreads">
    <h2>{{ $t('threads.latest.title') }}</h2>
    <p
      v-for="thread in replied"
      :key="thread.id"
    >
      {{ thread.data.title }}
    </p>
  </Column>
</template>

<script lang="ts">
import { useThreads } from '@/state/threads'
import { ThreadClass } from '@/state/threads/threads'
import { defineComponent, onMounted, ref } from 'vue'
import Column from '../layout/Column.vue'

export default defineComponent({
  name: 'TextStyles',
  components: { Column },
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
