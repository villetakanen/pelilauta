<template>
  <Column class="streamTopic double">
    <ThreadCard
      v-for="thread in localThreads"
      :key="thread.id"
      :thread="thread"
    />
    <Button
      text
      :disabled="atEnd"
      @click="nextPage()"
    >
      {{ $t('action.nextPage') }}
    </Button>
  </Column>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { toThread } from '@/state/threads'
import { Thread } from '@/utils/firestoreInterfaces'
import ThreadCard from '@/components/home/threadcard/ThreadCard.vue'
import { collection, getDocs, getFirestore, limit, orderBy, query, QueryDocumentSnapshot, startAfter, where } from '@firebase/firestore'
import Column from '../layout/Column.vue'
import Button from '../form/Button.vue'

export default defineComponent({
  name: 'Threadlist',
  components: {
    ThreadCard,
    Column,
    Button
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
    let offset:undefined|QueryDocumentSnapshot

    function fetchThreads (topic: string, count = 11) {
      const db = getFirestore()
      if (offset) {
        const q = query(collection(db, 'stream'), where('topic', '==', topic), orderBy('flowTime', 'desc'), startAfter(offset), limit(count))
        getDocs(q).then((snapshot) => {
          if (snapshot.size < count) atEnd.value = true
          snapshot.forEach((doc) => {
            if (!doc.data()?.sticky) localThreads.value.push(toThread(doc.id, doc.data()))
            offset = doc
          })
        })
      } else {
        const q = query(collection(db, 'stream'), where('topic', '==', topic), orderBy('flowTime', 'desc'), limit(count))
        getDocs(q).then((snapshot) => {
          if (snapshot.size < count) atEnd.value = true
          snapshot.forEach((doc) => {
            if (!doc.data()?.sticky) localThreads.value.push(toThread(doc.id, doc.data()))
            offset = doc
          })
        })
      }
    }

    async function nextPage () {
      if (atEnd.value) return
      fetchThreads(props.topic, 5)
    }

    onMounted(() => {
      atEnd.value = false
      offset = undefined
      fetchThreads(props.topic)
    })
    watch(() => props.topic, (val) => {
      localThreads.value = new Array<Thread>()
      atEnd.value = false
      offset = undefined
      fetchThreads(val)
    })

    return { nextPage, atEnd, localThreads }
  }
})
</script>

<style lang="sass" scoped>
.streamTopic
  display: flex
  flex-direction: column
  gap: 8px
  padding: 8px
</style>
