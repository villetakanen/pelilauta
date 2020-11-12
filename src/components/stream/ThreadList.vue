<template>
  <div class="stream">
    <ThreadCard
      v-for="thread in localThreads"
      :key="thread.id"
      :thread="thread"
    />
    <MaterialButton
      text
      :disabled="atEnd"
      :action="nextPage"
    >
      {{ $t('action.nextPage') }}
    </MaterialButton>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import { Thread, toThread } from '@/state/threads'
import MaterialButton from '@/components/material/MaterialButton.vue'
import ThreadCard from './ThreadCard'

export default defineComponent({
  name: 'Threadlist',
  components: {
    MaterialButton,
    ThreadCard
  },
  props: {
    topic: {
      required: true,
      type: String
    }
  },
  setup (props) {
    const localThreads = ref(new Array<Thread>())
    const atEnd = ref(false)
    let offset:undefined|firebase.firestore.DocumentReference

    function fetchThreads (topic: string, count = 5) {
      const db = firebase.firestore()
      if (offset) {
        // const cursor = db.collection('stream').doc(offset.id)
        db.collection('stream').where('topic', '==', topic).orderBy('flowTime', 'desc').startAfter(offset).limit(count).get().then((snapshot) => {
          if (snapshot.size < count) atEnd.value = true
          snapshot.forEach((doc) => {
            localThreads.value.push(toThread(doc.id, doc.data()))
            offset = doc
          })
        })
      } else {
        db.collection('stream').where('topic', '==', topic).orderBy('flowTime', 'desc').limit(count).get().then((snapshot) => {
          if (snapshot.size < count) atEnd.value = true
          snapshot.forEach((doc) => {
            localThreads.value.push(toThread(doc.id, doc.data()))
            offset = doc
          })
        })
      }
    }

    async function nextPage () {
      if (atEnd.value) return
      fetchThreads(props.topic)
    }

    onMounted(() => {
      fetchThreads(props.topic)
    })

    return { nextPage, atEnd, localThreads }
  }
})
</script>

<style lang="sass" scoped>
.stream
</style>
