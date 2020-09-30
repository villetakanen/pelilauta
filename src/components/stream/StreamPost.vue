<template>
  <MaterialCard class="stream-post">
    <transition name="fade">
      <div v-if="photoURL" class="avatar">
        <img :src="photoURL" :alt="nick"/>
      </div>
    </transition>
    <div :innerHTML="content"></div>
    <p class="caption">{{nick}}</p>
    <transition name="fade">
      <MaterialButton v-if="!replyBoxVisible" :action="showReply">Reply?</MaterialButton>
    </transition>
    <transition name="fade">
      <div v-if="replyBoxVisible">
        <div class="tester" contenteditable="true" v-on:paste="paste" @input="onInput"></div>
        <MaterialButton :action="post">Post!</MaterialButton>
      </div>
    </transition>
  </MaterialCard>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import * as firebase from 'firebase/app'
import 'firebase/auth'

export default defineComponent({
  components: {
    MaterialCard,
    MaterialButton
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
    onMounted(() => {
      const db = firebase.firestore()
      const authorRef = db.collection('profiles').doc(props.author)
      authorRef.get().then((doc) => {
        if (doc.exists) {
          nick.value = doc.data()?.nick
          photoURL.value = doc.data()?.photoURL
        }
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
      const streamRef = db.collection('stream').doc(props.postid).collection('replies')
      streamRef.add(
        {
          author: props.author,
          content: linkify(content.value),
          created: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
      })
    }

    return { nick, photoURL, showReply, replyBoxVisible, paste, onInput, linkify, post }
  }
})
</script>

<style lang="sass" scoped>
.tester
  background-color: white
  height: 100px
  width: 100%
</style>
