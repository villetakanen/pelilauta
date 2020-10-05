<template>
  <MaterialCard class="stream-post">
    <!-- The top bar -->
    <div class="stream-post-top-bar">
      <div
        class="avatar"
      >
        <transition
          v-if="photoURL"
          name="fade"
        >
          <img
            :src="photoURL"
            :alt="nick"
          >
        </transition>
      </div>

      <h3
        v-if="title"
        class="title"
      >
        {{ title }}
      </h3>
      <div class="caption">
        {{ nick }} {{ created }}
        <span v-if="topic">in
          <router-link :to="`/stream/topic/${topic.toLowerCase()}`">{{ topic }}</router-link>
        </span>
      </div>
    </div>

    <div class="stream-post-content">
      <div :innerHTML="content" />
    </div>

    <div class="replycount">
      <router-link :to="`/stream/view/${postid}`">
        {{ replies.length }} replies
      </router-link>
    </div>
  </MaterialCard>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import { useAuthz } from '@/lib/authz'

interface Reply {
  content: string;
  replyid: string;
  nick: string;
  author: string;
  createdSeconds?: number;
}

export default defineComponent({
  components: {
    MaterialCard
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
      type: Number,
      required: false,
      default: -1
    },
    title: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup (props) {
    const nick = ref('')
    const photoURL = ref('')
    const repliesTyped: Reply[] = []
    const replies = ref(repliesTyped)
    const { isAuthz } = useAuthz()

    function loadData (): void {
      const db = firebase.firestore()
      const authorRef = db.collection('profiles').doc(props.author)
      authorRef.get().then((doc) => {
        if (doc.exists) {
          nick.value = doc.data()?.nick
          photoURL.value = doc.data()?.photoURL
        }
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

    onMounted(() => {
      loadData()
    })
    watch(props, loadData)

    return { nick, photoURL, isAuthz, replies }
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
    .replycount
      @include TypeBody1()
      text-align: right
      padding-top: 4px

</style>
