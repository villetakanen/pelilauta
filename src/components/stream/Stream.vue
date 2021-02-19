<template>
  <div class="stream">
    <div
      v-for="(post) in posts"
      :key="post.id"
    >
      <div v-if="post && post.data.content">
        <ThreadCard
          :thread="post"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { toDisplayString } from '@/utils/firebaseTools'
import { useThreads } from '@/state/threads'
import ThreadCard from './ThreadCard.vue'

export default defineComponent({
  components: {
    ThreadCard
  },
  props: {
    topic: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup (props) {
    const { stream } = useThreads()

    const posts = computed(() => {
      if (props.topic) {
        return stream.value.filter((post) => (post.data.topic === props.topic))
      }
      return stream.value
    })

    return { posts, toDisplayString }
  }
})
</script>
