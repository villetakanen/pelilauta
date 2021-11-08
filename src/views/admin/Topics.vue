<template>
  <div>
    <AdminActions :title="$t('admin.action.topics')" />
    <main class="emptyLayout">
      <table
        class="dataTable"
        aria-label="Stream metadata"
      >
        <tr>
          <th scope="col">
            #
          </th>
          <th scope="col">
            Slug
          </th>
          <th scope="col">
            Topic
          </th>
          <th scope="col">
            Description
          </th>
          <th scope="col">
            Icon
          </th>
          <th scope="col">
            Count
          </th>
        </tr>
        <tr
          v-for="(topic, key) in topics"
          :key="key"
        >
          <td style="width: 3em">
            <Textfield v-model="topic.order" />
          </td>
          <td><Textfield v-model="topic.slug" /></td>
          <td><Textfield v-model="topic.name" /></td>
          <td><Textfield v-model="topic.description" /></td>
          <td>{{ topic.icon }}</td>
          <td>{{ topic.count }}</td>
        </tr>
      </table>
      <div class="toolbar">
        <div class="spacer" />
        <Button @click="updateTopics">
          Update
        </Button>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { Stream } from '@/state/threads/threads'
import Textfield from '@/components/form/Textfield.vue'
import Button from '@/components/form/Button.vue'
import AdminActions from '@/components/admin/AdminActions.vue'
import { doc, getFirestore, onSnapshot, collection, getDocs, updateDoc } from '@firebase/firestore'

export default defineComponent({
  name: 'About',
  components: {
    Textfield,
    Button,
    AdminActions
  },
  setup () {
    const topics = ref(new Array<Stream>())

    onMounted(() => {
      const db = getFirestore()
      const metaRef = doc(db, 'meta', 'pelilauta')
      onSnapshot(metaRef, (metaDoc) => {
        const t = new Array<Stream>()
        for (const key in metaDoc.data()?.streams) {
          t.push({
            slug: key,
            name: metaDoc.data()?.streams[key]?.name || key,
            description: metaDoc.data()?.streams[key]?.description || key,
            icon: metaDoc.data()?.streams[key]?.icon || 'none',
            count: metaDoc.data()?.streams[key]?.count || 0,
            order: metaDoc.data()?.streams[key]?.order || 0
          })
        }
        topics.value = t
      })
    })

    async function updateCounts () {
      const topicsMap = new Map<string, Stream>()
      topics.value.forEach((val) => {
        topicsMap.set(val.slug, val)
      })
      const db = getFirestore()
      const streamRef = collection(db, 'stream')
      getDocs(streamRef).then((s) => {
        topics.value.forEach((t) => {
          t.count = 0
        })
        s.forEach((doc) => {
          const rawTopic:string = doc.data()?.topic || '-'
          const topic = rawTopic
          if (!topicsMap.has(topic)) {
            topicsMap.set(topic, { slug: topic, name: topic, description: topic, icon: 'd12', count: 1, order: 0 })
          } else {
            topicsMap.forEach((t) => {
              if (t.slug === topic) t.count++
            })
          }
        })
        return updateDoc(doc(db, 'meta', 'pelilauta'), { streams: Object.fromEntries(topicsMap) })
      })
    }

    async function updateTopics () {
      return updateCounts()
    }

    return { topics, updateTopics }
  }
})
</script>

<style lang="sass" scoped>
.dataTable
  width: 100%
  td
    padding: 0px 8px
    text-align: center
</style>
