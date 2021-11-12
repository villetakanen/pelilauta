<template>
  <div id="publicProfileView">
    <Header v-if="user.uid !== uid">
      <ViewTitle
        v-if="publicProfile"
        icon="avatar"
      >
        {{ publicProfile.nick }}
      </ViewTitle>
    </Header>
    <ProfileToolbar v-else />
    <div class="singleColumnLayout">
      <div class="linkGrid">
        <div>
          <Icon
            name="discussion"
            medium
          />
        </div>
        <div>
          <Icon
            name="lightbulb"
            medium
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
import ProfileToolbar from '@/components/profile/ProfileToolbar.vue'
import { useAuthors } from '@/state/authors'
import { toThread } from '@/state/threads'
import { Thread } from '@/utils/firestoreInterfaces'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { getFirestore, collection, query, where, getDocs } from '@firebase/firestore'
import Icon from '@/components/material/Icon.vue'
import { useAuth } from '@/state/authz'
import Header from '@/components/layout/Header.vue'
import ViewTitle from '@/components/layout/ViewTitle.vue'

export default defineComponent({
  components: { Icon, ProfileToolbar, Header, ViewTitle },
  props: {
    uid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { authors } = useAuthors()
    const { user } = useAuth()
    const publicProfile = computed(() => (authors.value.find((val) => (val.uid === props.uid))))

    const threads = ref(new Array<Thread>())

    onMounted(() => {
      const db = getFirestore()
      const streamRef = collection(db, 'stream')

      const q = query(streamRef, where('author', '==', props.uid))
      getDocs(q).then((streamDocs) => {
        streamDocs.forEach((streamDoc) => {
          threads.value.push(toThread(streamDoc.id, streamDoc.data()))
        })
        threads.value.sort((a, b) => (a.replyCount > b.replyCount ? -1 : a.lovedCount > b.lovedCount ? -1 : 0))
      })
    })

    return { publicProfile, threads, user }
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
