<template>
  <div id="publicProfileView">
    <Toolbar>
      <h3 v-if="publicProfile">
        {{ publicProfile.nick }}
      </h3>
    </Toolbar>
    <div class="singleColumnLayout">
      <div class="linkGrid">
        <div>
          <Icon
            name="discussion"
            headline
          />
        </div>
        <div>
          <Icon
            name="lightbulb"
            headline
          />
        </div>
        <div>
          <h1 class="title">
            {{ $t('threads.topic') }}
          </h1>
        </div>
        <template
          v-for="thread in threads"
          :key="thread.id"
        >
          <div style="text-align: center">
            {{ thread.replyCount || 0 }}
          </div>
          <div style="text-align: center">
            {{ thread.lovedCount || 0 }}
          </div>
          <router-link :to="{ name: 'threads.view', params: { threadid: thread.id }}">
            {{ thread.data.title }}
          </router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Toolbar from '@/components/layout/Toolbar.vue'
import { useAuthors } from '@/state/authors'
import { toThread } from '@/state/threads'
import { Thread } from '@/utils/firestoreInterfaces'
import { computed, defineComponent, onMounted, ref } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import Icon from '@/components/material/Icon.vue'

export default defineComponent({
  components: { Toolbar, Icon },
  props: {
    uid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { authors } = useAuthors()
    const publicProfile = computed(() => (authors.value.find((val) => (val.uid === props.uid))))

    const threads = ref(new Array<Thread>())

    onMounted(() => {
      const db = firebase.firestore()
      const streamRef = db.collection('stream')
      streamRef.where('author', '==', props.uid).get().then((streamDocs) => {
        streamDocs.forEach((streamDoc) => {
          threads.value.push(toThread(streamDoc.id, streamDoc.data()))
        })
        threads.value.sort((a, b) => (a.replyCount > b.replyCount ? -1 : a.lovedCount > b.lovedCount ? -1 : 0))
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
  grid-template-columns: auto auto 1fr
  column-gap: 8px
  row-gap: 8px

</style>
