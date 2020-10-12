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
  </MaterialCard>
  <div class="replybox">
    <div
      v-for="(post) in replies"
      :key="post.replyid"
      class="reply"
    >
      <transition name="fade">
        <div v-if="post.content">
          <StreamReply
            :author="post.author"
            :content="post.content"
            :commentid="post.replyid"
            :nick="post.nick"
            :postid="postData.postid"
          />
        </div>
      </transition>
    </div>

    <transition name="fade">
      <MaterialCard v-if="replyBoxVisible">
        <Editor v-model="replyContent" />
        <div class="toolbar">
          <div class="spacer" />
          <MaterialButton :action="post">
            Post!
          </MaterialButton>
        </div>
      </MaterialCard>
    </transition>

    <transition name="fade">
      <MaterialCard
        v-if="!replyBoxVisible && showStreamActions"
        class="toolbar"
      >
        <div class="spacer" />
        <MaterialButton
          :action="showReply"
        >
          Reply
        </MaterialButton>
      </MaterialCard>
    </transition>
  </div>
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
import PostHeader from '@/components/stream/PostHeader.vue'
import { useRouter } from 'vue-router'
import { useMeta } from '@/lib/meta'

export default defineComponent({
  components: {
    MaterialCard,
    StreamReply,
    MaterialButton,
    Editor,
    PostHeader
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
      title: '',
      images: ''
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
          postData.value.images = doc.data()?.images

          const authorRef = db.collection('profiles').doc(postData.value.author)
          authorRef.get().then((authorDoc) => {
            authorData.value.nick = authorDoc.data()?.nick
            authorData.value.photoURL = authorDoc.data()?.photoURL
          })

          const repliesRef = db.collection('stream').doc(props.postid).collection('comments').orderBy('created', 'asc')
          repliesRef.onSnapshot((changes) => {
            changes.docChanges().forEach((change) => {
              if (change.type === 'added') {
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
              } else if (change.type === 'removed') {
                replies.value = replies.value.filter((reply) => (reply.replyid !== change.doc.id))
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
    }

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

    return { authorData, postData, replies, replyBoxVisible, replyContent, showReply, isAuthor, deletePost, post, showStreamActions }
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
