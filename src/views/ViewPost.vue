<template>
  <div class="viewer contentGrid">
    <MaterialCard>
      <div
        v-if="thread"
        class="postHeader"
      >
        <!-- The top bar -->
        <ThreadCardHeader :thread="thread" />
      </div>
      <div
        v-if="thread"
        class="postContent"
      >
        <div
          :innerHTML="thread.data.content"
        />

        <div class="credits">
          <transition name="fade">
            <div v-if="author">
              <p class="author">
                {{ author.nick }}
              </p>
              <p
                v-if="author.tagline"
                class="caption"
              >
                {{ author.tagline }}
              </p>
            </div>
          </transition>
        </div>

        <PhotoBox :photos="thread.data.images || []" />
        <div style="display:flex">
          <LoveAction
            :disabled="isAnonymous"
            :loved="loves"
            :action="toggleLove"
          />
          <div v-if="thread.lovedCount > 0">
            {{ thread.lovedCount }}
          </div>
        </div>
      </div>
    </MaterialCard>

    <Discussion :thread="thread" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, onMounted } from 'vue'
import Discussion from '@/components/discussion/Discussion.vue'
import { loveThread, unloveThread, deleteThread, useThreads } from '@/state/threads'
import { useAuthors } from '@/state/authors'
import PhotoBox from '@/components/stream/PhotoBox.vue'
import { useRouter } from 'vue-router'
import LoveAction from '@/components/app/LoveAction.vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import { useAuthState, useProfile } from '@/state/authz'
import ThreadCardHeader from '@/components/stream/ThreadCardHeader.vue'
import firebase from 'firebase/app'
import 'firebase/analytics'

export default defineComponent({
  components: {
    Discussion,
    PhotoBox,
    LoveAction,
    MaterialCard,
    ThreadCardHeader
  },
  props: {
    threadid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const router = useRouter()
    const { profileMeta } = useProfile()
    const { uid, isAnonymous } = useAuthState()

    const { thread } = useThreads()

    const { authors } = useAuthors()
    const author = computed(() => (authors.value.find((val) => (val.uid === thread.value.author))))

    function deletePost (): void {
      deleteThread(uid.value, props.threadid).then(() => {
        router.push('/')
      })
    }

    const loves = computed(() => {
      if (typeof profileMeta.value.lovedThreads === 'undefined') return false
      return profileMeta.value.lovedThreads.includes(props.threadid)
    })

    const toggleLove = async () => {
      if (loves.value) return unloveThread(uid.value, props.threadid)
      else return loveThread(uid.value, props.threadid)
    }

    onMounted(() => {
      watch(thread, (post) => {
        document.title = 'Pelilauta ' + post.data.title
        firebase.analytics().logEvent('openThread', { name: post.data.title, id: post.id })
      }, { immediate: true })
    })

    return { author, deletePost, isAnonymous, thread, toggleLove, loves }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.postHeader, .postContent
  background-color: $color-base

.postContent
  @include TypeBody2()
  color: $color-font-medium
  padding-top: 0
  text-overflow: ellipsis
  word-break: break-word

@include media('>tablet')
  .postContent
    @include TypeBody1()
    padding-top: 0

.replybox
  background-color: $color-base-darker
  margin-top: 8px
  padding-bottom: 8px

#app #mainContentWrapper main
  .stream-post
    position: relative
    word-break: break-word
    .stream-post-top-bar
      position: relative
      padding-left: 52px
      padding-bottom: 8px
    div.caption
      @include TypeCaption()
    div.avatar
      position: absolute
      left: 0
      top: 0
      border-radius: 50%

</style>
