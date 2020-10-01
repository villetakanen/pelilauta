<template>
  <MaterialCard class="stream-post">
    <transition name="fade">
      <div v-if="photoURL" class="avatar">
        <img :src="photoURL" :alt="nick"/>
      </div>
    </transition>
    <div :innerHTML="content"></div>
    <p class="caption">{{nick}}</p>

    <div v-for="(post, index) in replies" v-bind:key="index" class="reply">
      <transition name="fade">
        <div v-if="post.content">
          <StreamReply :author="post.author" :content="post.content" :postid="post.replyid" :nick="post.nick"/>
        </div>
      </transition>
    </div>

    <transition name="fade">
      <div v-if="replyBoxVisible">
        <div class="tester" contenteditable="true" v-on:paste="paste" @input="onInput"></div>
        <MaterialButton :action="post">Post!</MaterialButton>
      </div>
    </transition>
     <transition name="fade">
      <MaterialButton v-if="!replyBoxVisible && isAuthz" :action="showReply">Reply?</MaterialButton>
    </transition>
  </MaterialCard>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import StreamReply from './StreamReply.vue'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import { useAuthz } from '@/lib/authz'

interface Reply {
  content: string;
  replyid: string;
  nick: string;
  author: string;
}

export default defineComponent({
  components: {
    MaterialCard,
    MaterialButton,
    StreamReply
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
    }
  },
  setup (props) {
    const nick = ref('')
    const photoURL = ref('')
    const replyBoxVisible = ref(false)
    const content = ref('')
    const repliesTyped: Reply[] = []
    const replies = ref(repliesTyped)
    const { uid, profile, isAuthz } = useAuthz()

    onMounted(() => {
      const db = firebase.firestore()
      const authorRef = db.collection('profiles').doc(props.author)
      authorRef.get().then((doc) => {
        if (doc.exists) {
          nick.value = doc.data()?.nick
          photoURL.value = doc.data()?.photoURL
        }
      })
      const repliesRef = db.collection('stream').doc(props.postid).collection('comments')
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
              nick: change.doc.data()?.nick
            })
          }
        })
      })
    })
    function showReply () {
      replyBoxVisible.value = true
    }
    function paste (event: ClipboardEvent) {
      event.preventDefault()
      event.stopPropagation()
      const pasted = event.clipboardData?.getData('text/plain')
      const selection = window.getSelection()
      if (selection && pasted) {
        selection.getRangeAt(0).insertNode(document.createTextNode(pasted))
        selection.collapseToEnd()
      }
      const target = event.target as HTMLElement
      content.value = target.innerHTML
    }
    function onInput (event: Event) {
      const target = event.target as HTMLElement
      content.value = target.innerHTML
    }

    function linkify (inputText: string): string {
      // URLs starting with http://, https://, or ftp://
      const replacePattern1 = '/(\b(https?|ftp):\\/\\/[-A-Z0-9+&@#\\/%?=~_|!:,.;]*[-A-Z0-9+&@#\\/%=~_|])/gim'
      const replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>')

      return replacedText
    }

    function post (): void {
      console.log('post!', props.author)
      console.log()
      const db = firebase.firestore()
      const streamRef = db.collection('stream').doc(props.postid).collection('comments')
      console.log(uid.value, profile.value.nick)
      streamRef.add(
        {
          author: uid.value,
          nick: profile.value.nick,
          content: linkify(content.value),
          created: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
      })
    }

    return { nick, photoURL, showReply, replyBoxVisible, paste, onInput, linkify, post, replies, isAuthz }
  }
})
</script>

<style lang="sass" scoped>
@import ../../styles/material-typography.sass

#app #mainContentWrapper main
  .tester
    background-color: white
    height: 100px
    width: 100%
  p.caption
    padding-bottom: 4px
  .reply
    border-top: solid 1px rgba(0,0,0,0.1)
    margin-top: 4px
    padding-top: 3px
    @include TypeBody2()
    p.author
      float: left
      font-weight: 500
      margin:0
      margin-right: 8px
      padding:0
      line-height: 24px
      color: #666

</style>
