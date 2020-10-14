<template>
  <MaterialCard class="stream-post">
    <!-- The top bar -->
    <PostHeader
      :nick="authorData.nick"
      :photo="authorData.photoURL"
      :title="postData.title"
      :postid="postData.postid"
      :created="postData.created + ''"
      :topic="postData.topic"
      :tslug="postData.topic.toLowerCase()"
      :author="postData.author"
    />

    <div
      class="stream-post-content"
      :innerHTML="postData.content"
    />

    <div
      v-if="postData.images"
      class="images"
    >
      <img
        v-for="url in postData.images.split(';')"
        :key="url"
        :src="url"
      >
    </div>

    <Discussion :postid="postid" />
  </MaterialCard>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import Discussion from '@/components/stream/Discussion.vue'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { Post, Profile, useStream } from '@/lib/stream'
import { useAuthz } from '@/lib/authz'
import PostHeader from '@/components/stream/PostHeader.vue'
import { useRouter } from 'vue-router'
import { useMeta } from '@/lib/meta'

export default defineComponent({
  components: {
    MaterialCard,
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
    const postData = ref({} as Post)

    const authorDataTyped: Profile = {
      nick: '',
      photoURL: ''
    }
    const authorData = ref(authorDataTyped)

    const { uid } = useAuthz()

    const getPostData = () => {
      const db = firebase.firestore()
      const { getPost } = useStream()
      getPost(props.postid).then((post) => {
        if (post) {
          postData.value = post
          const authorRef = db.collection('profiles').doc(postData.value.author)
          authorRef.get().then((authorDoc) => {
            authorData.value.nick = authorDoc.data()?.nick
            authorData.value.photoURL = authorDoc.data()?.photoURL
          })
        }
      })
    }
    onMounted(() => getPostData())

    /* function showReply () {
      replyBoxVisible.value = true
    } */

    /* function post (): void {
      const db = firebase.firestore()
      const streamRef = db.collection('stream').doc(props.postid).collection('comments')
      streamRef.add(
        {
          author: uid.value,
          nick: profile.value.nick,
          content: replyContent.value,
          created: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
        replyContent.value = ''
        replyBoxVisible.value = false
      })
    } */

    const isAuthor = computed((): boolean => (uid.value === postData.value.author))

    function deletePost (): void {
      const db = firebase.firestore()
      const postRef = db.collection('stream').doc(props.postid)
      postRef.delete().then(() => {
        const router = useRouter()
        router.push('/')
      })
    }

    const { showStreamActions } = useMeta()

    return { authorData, postData, isAuthor, deletePost, showStreamActions }
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
