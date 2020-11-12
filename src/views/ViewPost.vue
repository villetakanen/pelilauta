<template>
  <div class="viewer">
    <div
      v-if="post"
      class="postHeader"
    >
      <!-- The top bar -->
      <PostHeader
        :nick="author.nick"
        :photo="author.photoURL"
        :title="post.data.title"
        :threadid="post.id"
        :created="toDisplayString(post.created)"
        :topic="post.data.topic"
        :author="post.author"
      />
    </div>

    <div
      v-if="post"
      class="postContent"
    >
      <div
        :innerHTML="post.data.content"
      />

      <PhotoBox :photos="post.data.images" />
      <div style="display:flex">
        <LoveAction
          :loved="loves"
          :action="toggleLove"
        />
        <div v-if="post.lovedCount > 0">
          {{ post.lovedCount }}
        </div>
      </div>
    </div>

    <Discussion :threadid="threadid" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, onMounted } from 'vue'
import Discussion from '@/components/discussion/Discussion.vue'
import { useThreads, loveThread, unloveThread, deleteThread } from '@/state/threads'
import { useStream } from '@/lib/stream'
import { useAuthors } from '@/lib/authors'
import PostHeader from '@/components/stream/PostHeader.vue'
import PhotoBox from '@/components/stream/PhotoBox.vue'
import { useRouter } from 'vue-router'
import { useMeta } from '@/lib/meta'
import { useAuthz } from '@/lib/authz'
import LoveAction from '@/components/app/LoveAction.vue'

export default defineComponent({
  components: {
    PostHeader,
    Discussion,
    PhotoBox,
    LoveAction
  },
  props: {
    threadid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const router = useRouter()
    const { uid, profile } = useAuthz()

    const { toDisplayString } = useStream()
    const { stream } = useThreads()
    const post = computed(() => {
      return stream.value.filter((post) => (post.id === props.threadid))[0]
    })

    const { getAuthor } = useAuthors()
    const author = computed(() => (getAuthor(post.value?.author)))

    function deletePost (): void {
      deleteThread(uid.value, props.threadid).then(() => {
        router.push('/')
      })
    }

    const loves = computed(() => {
      if (typeof profile.value.lovedThreads === 'undefined') return false
      return profile.value.lovedThreads.includes(props.threadid)
    })

    const toggleLove = () => {
      if (loves.value) unloveThread(uid.value, props.threadid)
      else loveThread(uid.value, props.threadid)
    }

    const { showStreamActions } = useMeta()

    onMounted(() => {
      document.title = 'Pelilauta ' + post.value.data.title
      watch(post, (post) => {
        document.title = 'Pelilauta ' + post.data.title
      })
    })

    return { author, deletePost, showStreamActions, post, toDisplayString, toggleLove, loves }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.postHeader, .postContent
  background-color: $color-base
  padding: 16px

.postContent
  @include TypeBody2()
  padding: 16px
  color: $color-font-medium
  padding-top: 0

@include media('>tablet')
  .postContent
    @include TypeBody1()
    padding-top: 0
    padding: 16px

.replybox
  background-color: $color-base-darker
  margin-top: 8px
  padding-bottom: 8px

#app #mainContentWrapper main
  .stream-post
    position: relative
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
    .stream-post-content
      background-color: $color-base-dark
      padding: 4px

</style>
