<template>
  <div class="stream">
    <div v-for="(post, index) in latestPosts" v-bind:key="index">
      <div v-if="post.content" style="background-color:rgba(255,255,255,0.4); padding: 4px;margin-top:4px">
      <div :innerHTML="post.content"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, onUnmounted } from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/auth'

interface Post {
  author: string;
  content: string;
  created: number;
}

export default defineComponent({
  setup () {
    const postStruct: Post[] = []
    const latestPosts = ref(postStruct)
    let unsubscribe = () => {}
    onMounted(() => {
      const db = firebase.firestore()
      const streamRef = db.collection('stream')
      unsubscribe = streamRef.orderBy('created', 'desc').limit(11).onSnapshot((snapshot) => {
        latestPosts.value = []
        const arrr: Post[] = []
        snapshot.docChanges().forEach((change) => {
          arrr.push({
            author: change.doc.data()?.author as string,
            content: change.doc.data()?.content as string,
            created: change.doc.data().created.seconds as number
          })
        })
        latestPosts.value = arrr
      })
    })
    onUnmounted(() => { unsubscribe() })
    return { latestPosts }
  }
})
</script>
