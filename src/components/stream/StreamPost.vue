<template>
  <MaterialCard class="stream-post">
    <!-- The top bar -->
    <PostHeader
      :nick="nick"
      :photo="photoURL"
      :title="title"
      :postid="postid"
      :created="created"
      :topic="topic"
      :tslug="topic.toLowerCase()"
      :author="author"
    />

    <div class="stream-post-content">
      <div :innerHTML="content" />
    </div>

    <div
      v-if="images"
      class="images"
    >
      <img
        v-for="url in images"
        :key="url"
        :src="url"
      >
    </div>

    <div
      v-if="replycount > 0"
      class="replycount"
    >
      <router-link :to="`/stream/view/${postid}`">
        {{ replycount }} replies
      </router-link>
    </div>
  </MaterialCard>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import PostHeader from './PostHeader.vue'
import { useAuthz } from '@/lib/authz'
import { useAuthors } from '@/lib/authors'

export default defineComponent({
  components: {
    MaterialCard,
    PostHeader
  },
  props: {
    content: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    postid: {
      type: String,
      required: true
    },
    topic: {
      type: String,
      required: false,
      default: ''
    },
    created: {
      type: String,
      required: false,
      default: -1
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    images: {
      type: Array,
      required: false,
      default: new Array<string>()
    },
    replycount: {
      type: Number,
      required: false,
      default: -1
    }
  },
  setup (props) {
    const { isAuthz } = useAuthz()

    const { authors } = useAuthors()
    // console.log(authors, authors.value.find((a) => (a.uid === props.author)))

    const nick = computed(() => (authors.value.find((a) => (a.uid === props.author))?.nick))
    const photoURL = computed(() => (authors.value.find((a) => (a.uid === props.author))?.photoURL))

    return { nick, photoURL, isAuthz }
  }
})
</script>

<style lang="sass" scoped>
@import ../../styles/material-typography.sass
@import @/styles/material-colors.sass

#app #mainContentWrapper main
  .tester
    background-color: white
    height: 100px
    width: 100%
  p.caption
    padding-bottom: 4px
  div.replies
    border-top: solid 1px $color-base-darker
  .stream-post
    position: relative
    box-shadow: none
    .images
      height: 48px
      width: 100%
      display: flex
      img
        max-height: 44px
        max-width: 44px
        padding: 2px
        background-color: $color-secondary-light
        margin-right: 4px
    .stream-post-top-bar
      a
        text-decoration: none
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
      //background-color: $color-base-dark
      @include TypeBody2()
      padding: 8px
      word-break: break-word
      overflow-x: hidden
    .replycount
      @include TypeBody1()
      text-align: right
      padding-top: 4px

</style>
