<template>
  <MaterialCard>
    <p v-if="!isAuthz">Please <a href="/login">login</a> to post</p>
    <div :style="isAuthz ? '' : 'height: 0; overflow: hidden'">
      <div id="editorjs" />
      <MaterialButton :disabled="!isAuthz" :action="post">Post!</MaterialButton>
    </div>
  </MaterialCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import EditorJS from '@editorjs/editorjs'
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
    const { isAuthz, uid } = useAuthz()

    const editor = new EditorJS({
      holder: 'editorjs',
      minHeight: 24
    })
    editor.isReady.then(() => {})

    function post (): void {
      console.log('post!', uid)
      const db = firebase.firestore()
      const streamRef = db.collection('stream')
      editor.save().then((editorData) => {
        streamRef.add(
          {
            author: uid.value,
            blockContent: editorData,
            created: firebase.firestore.FieldValue.serverTimestamp()
          }).then(() => {
          editor.blocks.clear()
        })
      })
    }

    return { isAuthz, post }
  }
})
</script>

<style lang="sass" scoped>
#editorjs
  background-color: white
</style>
