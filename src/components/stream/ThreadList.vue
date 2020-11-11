<template>
  <div class="stream">
    <div
      v-for="thread in localThreads"
      :key="thread.id"
    >
      {{ thread.name }}
    </div>
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

export default defineComponent({
  name: 'Threadlist',
  components: {
    MaterialButton
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

    function fetchThreads (topic: string, count = 10, offset?:Thread) {
      const db = firebase.firestore()
      if (offset) {
        const cursor = db.collection('stream').doc(offset.id)
        db.collection('stream').where('topic', '==', topic).orderBy('flowTime', 'desc').startAt(cursor).limit(count).get().then((snapshot) => {
          if (snapshot.size < count) atEnd.value = true
          snapshot.forEach((doc) => {
            localThreads.value.push(toThread(doc))
          })
        })
      } else {
        db.collection('stream').where('topic', '==', topic).orderBy('flowTime', 'desc').limit(count).get().then((snapshot) => {
          if (snapshot.size < count) atEnd.value = true
          snapshot.forEach((doc) => {
            localThreads.value.push(toThread(doc))
          })
        })
      }
    }

    async function nextPage () {
      if (atEnd.value) return
      fetchThreads(props.topic, 10, localThreads.value[localThreads.value.length - 1])
    }

    onMounted(() => {
      fetchThreads(props.topic)
    })

    return { nextPage, atEnd }
  }
})
</script>

<style lang="sass" scoped>
.stream
</style>
