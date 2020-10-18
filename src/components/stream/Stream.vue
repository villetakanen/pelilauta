<template>
  <div class="stream">
    <div
      v-for="(post) in posts"
      :key="post.postid"
    >
      <div v-if="post.data.content">
        <StreamPost
          :created="toDisplayString(post.created)"
          :topic="post.data.topic"
          :author="post.author"
          :content="post.data.content"
          :postid="post.postid"
          :title="post.data.title"
          :images="post.data.images"
          :replycount="post.replyCount"
          :lovecount="post.lovedCount"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import StreamPost from './StreamPost.vue'
import { useStream } from '@/lib/stream'

export default defineComponent({
  components: {
    StreamPost
  },
  props: {
    topic: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup (props) {
    const { stream, toDisplayString } = useStream()

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
