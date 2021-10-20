<template>
  <Column class="LatestThreads">
    <h2>{{ $t('threads.latest.title') }}</h2>
    <p
      v-for="thread in latest"
      :key="thread.id"
    >
      {{ thread.commented.title }}
    </p>
  </Column>
</template>

<script lang="ts">
import { useThreads } from '@/state/threads'
import { Thread } from '@/utils/firestoreInterfaces'
import { computed, defineComponent } from 'vue'
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
    const { stream } = useThreads()
    const latest = computed(() => {
      const a:Thread[] = [...stream.value]
      if (a.length > props.count) a.length = props.count
      console.debug(a.length)
      return a
    })
    return { latest }
  }
})
</script>
