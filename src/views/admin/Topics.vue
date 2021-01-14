<template>
  <MaterialCard>
    <h1>Topic admin</h1>
    {{ topics }}
</MaterialCard>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { Stream } from '@/state/threads/threads'

export default defineComponent({
  name: 'About',
  components: {
    MaterialCard
  },
  setup () {
    const topics = ref(new Array<Stream>())
    onMounted(() => {
      const db = firebase.firestore()
      const metaRef = db.collection('meta').doc('pelilauta')
      metaRef.onSnapshot((metaDoc) => {
        console.log(metaDoc.data()?.streams)
        const t = new Array<Stream>()
        for (const key in metaDoc.data()?.streams) {
          t.push({
            slug: key,
            name: metaDoc.data()?.streams[key]?.name || key,
            description: metaDoc.data()?.streams[key]?.description || key,
            icon: metaDoc.data()?.streams[key]?.icon || 'none',
            count: metaDoc.data()?.streams[key]?.count || 0
          })
        }
        topics.value = t
      })
    })
    return { topics }
  }
})
</script>
