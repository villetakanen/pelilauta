<template>
  <MaterialCard>
    <transition name="fade">
      <p v-if="!isAuthz">Please <a href="/login">login</a> to post</p>
    </transition>
    <transition name="fade">
      <div v-if="isAuthz">
        <div class="tester" contenteditable="true" v-on:paste="paste" @input="onInput"></div>
        <MaterialButton :disabled="!isAuthz" :action="post">Post!</MaterialButton>
      </div>
    </transition>
  </MaterialCard>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import MaterialButton from '@/components/material/MaterialButton.vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import { useAuthz } from '@/lib/authz'

export default defineComponent({
  name: 'Home',
  components: {
    MaterialButton,
    MaterialCard
  },
  setup () {
    const content = ref('')
    const { isAuthz, uid } = useAuthz()

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
      console.log('post!', uid)
      console.log()
      const db = firebase.firestore()
      const streamRef = db.collection('stream')
      streamRef.add(
        {
          author: uid.value,
          content: linkify(content.value),
          created: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
      })
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

    return { isAuthz, post, paste, onInput, content, linkify }
  }
})
</script>

<style lang="sass" scoped>
#editorjs
  background-color: white
.minimized
  height: 0px
  overflow: hidden
  transition: height 3.0s
.minimized.openOnClick
  height: 300px
  transition: height 3.0s
.tester
  background-color: white
  height: 100px
  width: 100%
</style>
