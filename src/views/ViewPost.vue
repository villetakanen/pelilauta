<template>
  <div class="viewer">
    <div class="post-header">
      <!-- The top bar -->
      <PostHeader
        :nick="author.nick"
        :photo="author.photoURL"
        :title="post.data.title"
        :postid="post.postid"
        :created="post.created + ''"
        :topic="post.data.topic"
        :author="post.author"
      />
    </div>

    <div
      class="stream-post-content"
      :innerHTML="post.data.content"
    />

    <div
      v-if="post.data.images"
      class="images"
    >
      <img
        v-for="url in post.data.images"
        :key="url"
        :src="url"
      >
    </div>

    <Discussion :postid="postid" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import Discussion from '@/components/stream/Discussion.vue'
import { useStream } from '@/lib/stream'
import { useAuthors } from '@/lib/authors'
import PostHeader from '@/components/stream/PostHeader.vue'
import { useRouter } from 'vue-router'
import { useMeta } from '@/lib/meta'
import { useAuthz } from '@/lib/authz'

export default defineComponent({
  components: {
    PostHeader,
    Discussion
  },
  props: {
    postid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const router = useRouter()
    const { uid } = useAuthz()
    const { stream, dropPost } = useStream()
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

    const { showStreamActions } = useMeta()

    return { author, deletePost, showStreamActions, post }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
@import @/styles/material-colors.sass

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
