<template>
  <div class="stream">
    {{ latestPosts }}
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, onUnmounted } from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/auth'

export default defineComponent({
  setup () {
    const latestPosts = ref('')
    let unsubscribe = () => {}
    onMounted(() => {
      const db = firebase.firestore()
      const streamRef = db.collection('stream')
      unsubscribe = streamRef.orderBy('created', 'desc').limit(11).onSnapshot((snapshot) => {
        latestPosts.value = ''
        const arrr: string[] = []
        snapshot.docChanges().forEach((change) => {
          arrr.push(JSON.stringify(change.doc.data()))
        })
        latestPosts.value = arrr.join('--------')
      })
    })
    onUnmounted(() => { unsubscribe() })
    return { latestPosts }
  }
})
</script>
