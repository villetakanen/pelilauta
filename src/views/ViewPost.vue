<template>
  <MaterialCard class="stream-post">
    <!-- The top bar -->
    <div class="stream-post-top-bar">
      <div
        class="avatar"
      >
        <transition
          name="fade"
        >
          <img
            v-if="authorData.photoURL"
            :src="authorData.photoURL"
            :alt="authorData.nick"
          >
        </transition>
      </div>

      <h3
        v-if="postData.title"
        class="title"
      >
        {{ postData.title }}
      </h3>
      <div class="caption">
        {{ authorData.nick }} {{ postData.created }}
        <span v-if="postData.topic">in
          <router-link :to="`/stream/topic/${postData.topic.toLowerCase()}`">{{ postData.topic }}</router-link>
        </span>
      </div>
    </div>
    <div
      class="stream-post-content"
      :innerHTML="postData.content"
    />
    <div
      v-for="(post, index) in replies"
      :key="index"
      class="reply"
    >
      <transition name="fade">
        <div v-if="post.content">
          <StreamReply
            :author="post.author"
            :content="post.content"
            :postid="post.replyid"
            :nick="post.nick"
          />
        </div>
      </transition>
    </div>

    <transition name="fade">
      <div v-if="replyBoxVisible">
        <Editor v-model="replyContent" />
        <MaterialButton :action="post">
          Post!
        </MaterialButton>
      </div>
    </transition>

    <transition name="fade">
      <div
        v-if="!replyBoxVisible"
        class="toolbar"
      >
        <div class="spacer" />
        <MaterialButton
          v-if="isAuthor"
          text
          :action="deletePost"
        >
          Delete
        </MaterialButton>
        <MaterialButton
          :action="showReply"
        >
          Reply
        </MaterialButton>
      </div>
    </transition>
  </MaterialCard>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import Editor from '@/components/editor/Editor.vue'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { Post, Profile, Reply } from '@/lib/stream'
import { useAuthz } from '@/lib/authz'
import StreamReply from '@/components/stream/StreamReply.vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  components: {
    MaterialCard,
    StreamReply,
    MaterialButton,
    Editor
  },
  props: {
    postid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const postDataTyped: Post = {
      postid: '',
      author: '',
      content: '',
      created: -1,
      topic: '',
      title: ''
    }
    const postData = ref(postDataTyped)

    const authorDataTyped: Profile = {
      nick: '',
      photoURL: ''
    }
    const authorData = ref(authorDataTyped)

    const repliesTyped: Reply[] = []
    const replies = ref(repliesTyped)

    const replyBoxVisible = ref(false)
    const replyContent = ref('')

    const { uid, profile } = useAuthz()

    const getPostData = () => {
      const db = firebase.firestore()
      const postRef = db.collection('stream').doc(props.postid)
      postRef.get().then((doc) => {
        if (doc.exists) {
          postData.value.postid = props.postid
          postData.value.content = doc.data()?.content
          postData.value.title = doc.data()?.title
          postData.value.topic = doc.data()?.topic
          postData.value.created = doc.data()?.created.seconds
          postData.value.author = doc.data()?.author

          const authorRef = db.collection('profiles').doc(postData.value.author)
          authorRef.get().then((authorDoc) => {
            authorData.value.nick = authorDoc.data()?.nick
            authorData.value.photoURL = authorDoc.data()?.photoURL
          })

          const repliesRef = db.collection('stream').doc(props.postid).collection('comments').orderBy('created', 'asc')
          repliesRef.onSnapshot((changes) => {
            changes.docChanges().forEach((change) => {
              let rfound = false
              replies.value.forEach((reply) => {
                if (reply.replyid === change.doc.id) rfound = true
              })
              if (!rfound) {
                replies.value.push({
                  replyid: change.doc.id,
                  content: change.doc.data()?.content,
                  author: change.doc.data()?.author,
                  nick: change.doc.data()?.nick,
                  createdSeconds: change.doc.data()?.created?.seconds
                })
              }
            })
          })
        }
      })
    }
    onMounted(() => getPostData())

    function showReply () {
      replyBoxVisible.value = true
    }

    function post (): void {
      console.log('post!', uid.value, postData.value.author)
      console.log()
      const db = firebase.firestore()
      const streamRef = db.collection('stream').doc(props.postid).collection('comments')
      console.log(uid.value, profile.value.nick)
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
    }

    const isAuthor = computed((): boolean => (uid.value === postData.value.author))

    function deletePost (): void {
      console.log('deletePost', uid.value, postData.value.author)
      const db = firebase.firestore()
      const postRef = db.collection('stream').doc(props.postid)
      postRef.delete().then(() => {
        const router = useRouter()
        router.push('/')
      })
    }

    return { authorData, postData, replies, replyBoxVisible, replyContent, showReply, isAuthor, deletePost, post }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
@import @/styles/material-colors.sass

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
