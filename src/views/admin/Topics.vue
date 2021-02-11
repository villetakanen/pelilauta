<template>
  <div>
    <AdminActions :title="$t('admin.action.topics')" />
    <MaterialCard style="margin-left: 8px; margin-right: 8px">
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
            <TextField v-model="topic.order" />
          </td>
          <td><TextField v-model="topic.slug" /></td>
          <td><TextField v-model="topic.name" /></td>
          <td><TextField v-model="topic.description" /></td>
          <td>{{ topic.icon }}</td>
          <td>{{ topic.count }}</td>
        </tr>
      </table>
      <div class="toolbar">
        <div class="spacer" />
        <MaterialButton :action="updateTopics">
          Update
        </MaterialButton>
      </div>
    </MaterialCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { Stream } from '@/state/threads/threads'
import TextField from '@/components/material/TextField.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import AdminActions from '@/components/admin/AdminActions.vue'

export default defineComponent({
  name: 'About',
  components: {
    MaterialCard,
    TextField,
    MaterialButton,
    AdminActions
  },
  setup () {
    const topics = ref(new Array<Stream>())

    onMounted(() => {
      const db = firebase.firestore()
      const metaRef = db.collection('meta').doc('pelilauta')
      metaRef.onSnapshot((metaDoc) => {
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
      const db = firebase.firestore()
      const streamRef = db.collection('stream')
      streamRef.get().then((s) => {
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
        return db.collection('meta').doc('pelilauta').update({ streams: Object.fromEntries(topicsMap) })
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
