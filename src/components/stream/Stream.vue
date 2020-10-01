<template>
  <div class="stream">
    <div v-if="latestPosts.length > 0">
      <div v-for="(post, index) in latestPosts" v-bind:key="index">
        <div v-if="post.content">
          <StreamPost
            :topic="post.topic"
            :author="post.author"
            :content="post.content"
            :postid="post.postid" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, onUnmounted } from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import StreamPost from './StreamPost.vue'

export interface Post {
  author: string;
  content: string;
  created: number;
  postid: string;
  topic?: string;
}

export default defineComponent({
  components: {
    StreamPost
  },
  setup () {
    const postStruct: Post[] = []
    const latestPosts = ref(postStruct)
    let unsubscribe = () => {}
    onMounted(() => {
      const db = firebase.firestore()
      const streamRef = db.collection('stream')
      unsubscribe = streamRef.orderBy('created', 'desc').limit(11).onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          let hasPost = false
          latestPosts.value.forEach((post) => {
            if (post.postid === change.doc.id) {
              hasPost = true
              post.content = change.doc.data()?.content
            }
          })
          if (!hasPost) {
            latestPosts.value.push({
              author: change.doc.data()?.author as string,
              content: change.doc.data()?.content as string,
              created: change.doc.data().created.seconds as number,
              postid: change.doc.id,
              topic: change.doc.data().topic
            })
          }
        })
      })
    })
    onUnmounted(() => { unsubscribe() })
    return { latestPosts }
  }
})
</script>
