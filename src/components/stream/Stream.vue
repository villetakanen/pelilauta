<template>
  <div class="stream">
    <div
      v-for="(post) in posts"
      :key="post.postid"
    >
      <div v-if="post.content">
        <StreamPost
          :created="post.created"
          :topic="post.data.topic"
          :author="post.author"
          :content="post.data.content"
          :postid="post.postid"
          :title="post.data.title"
          :images="post.data.images"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, onUnmounted, computed } from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import StreamPost from './StreamPost.vue'
import { useStream } from '@/lib/stream'

export interface Post {
  author: string;
  content: string;
  created: number;
  postid: string;
  topic?: string;
  title?: string;
  images?: string;
  flowTime: firebase.firestore.Timestamp;
}

interface PostData {
  created: {
    seconds: number;
  };
}

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
    const { stream } = useStream()

    // unsubscribe to the Firebase onSnapshot listener
    const unsubscribe = () => {}

    const capitalize = (s: string) => {
      return s.charAt(0).toUpperCase() + s.slice(1)
    }

    const posts = computed(() => {
      if (props.topic) {
        return stream.value.filter((post) => (post.data.topic === props.topic))
      }
      return stream.value
    })
    return { posts }
  }
})
</script>
