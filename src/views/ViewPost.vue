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
        :postid="post.postid"
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

    <Discussion :postid="postid" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import Discussion from '@/components/stream/Discussion.vue'
import { loveThread, unloveThread } from '@/state/threads'
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
    postid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const router = useRouter()
    const { uid, profile } = useAuthz()

    const { stream, dropPost, toDisplayString } = useStream()
    const post = computed(() => {
      return stream.value.filter((post) => (post.postid === props.postid))[0]
    })

    const { getAuthor } = useAuthors()
    const author = computed(() => (getAuthor(post.value?.author)))

    function deletePost (): void {
      dropPost(uid.value, props.postid).then(() => {
        router.push('/')
      })
    }

    const loves = computed(() => {
      if (typeof profile.value.lovedThreads === 'undefined') return false
      return profile.value.lovedThreads.includes(props.postid)
    })

    const toggleLove = () => {
      if (loves.value) unloveThread(uid.value, props.postid)
      else loveThread(uid.value, props.postid)
    }

    const { showStreamActions } = useMeta()

    return { author, deletePost, showStreamActions, post, toDisplayString, toggleLove, loves }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
@import @/styles/material-colors.sass

.viewer
  .postHeader, .postContent
    background-color: $color-base
    padding: 8px

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
