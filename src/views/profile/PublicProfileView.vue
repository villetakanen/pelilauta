<template>
  <div id="publicProfileView">
    <Toolbar>
      <h3 v-if="publicProfile">
        {{ publicProfile.nick }}
      </h3>
    </Toolbar>
    <MaterialCard>
      <div class="linkGrid">
        <div><strong>Loves</strong></div>
        <div><strong>Topic</strong></div>
        <template
          v-for="thread in threads"
          :key="thread[0]"
        >
          <div style="text-align: center">
            {{ thread[1].lovedCount || 0 }}
          </div>
          <router-link :to="{ name: 'stream.view', params: { threadid: thread[1].id }}">
            {{ thread[1].data.title }}
          </router-link>
        </template>
      </div>
    </MaterialCard>
  </div>
</template>

<script lang="ts">
import Toolbar from '@/components/layout/Toolbar.vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import { useAuthors } from '@/state/authors'
import { Thread, toThread } from '@/state/threads'
import { computed, defineComponent, onMounted, ref } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'

export default defineComponent({
  components: { Toolbar, MaterialCard },
  props: {
    uid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { authors } = useAuthors()
    console.log(authors, props.uid)
    const publicProfile = computed(() => (authors.value.find((val) => (val.uid === props.uid))))

    const threads = ref(new Map<string, Thread>())

    onMounted(() => {
      const db = firebase.firestore()
      const streamRef = db.collection('stream')
      streamRef.where('author', '==', props.uid).get().then((streamDocs) => {
        console.log('got stream. threads: ', streamDocs.size)
        streamDocs.forEach((streamDoc) => {
          threads.value.set(streamDoc.id, toThread(streamDoc.id, streamDoc.data()))
        })
      })
    })

    return { publicProfile, threads }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.linkGrid
  display: grid
  grid-template-columns: auto 1fr
  column-gap: 8px
  row-gap: 8px

</style>
