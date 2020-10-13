<template>
  <MaterialCard>
    <transition name="fade">
      <p v-if="!isAuthz">
        Please <a href="/login">login</a> to post
      </p>
    </transition>
    <transition name="fade">
      <div v-if="isAuthz">
        <div class="toolbar">
          <div class="grow">
            <input
              v-model="title"
              class="material-textfield"
              type="text"
              :placeholder="titlePlaceHolder"
            >
          </div>
          <select
            v-model="chosenTopic"
            name="topic"
          >
            <option
              v-for="(t) in topics"
              :key="t.slug"
              :value="t.slug"
            >
              {{ t.title }}
            </option>
          </select>
        </div>
        <!--div class="tester" contenteditable="true" v-on:paste="paste" @input="onInput" </div-->
        <Editor
          v-model="content"
          v-model:images="images"
        />
        <div class="toolbar">
          <div class="spacer" />
          <MaterialButton
            :disabled="!isAuthz"
            :action="post"
          >
            Post!
          </MaterialButton>
        </div>
      </div>
    </transition>
  </MaterialCard>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import MaterialButton from '@/components/material/MaterialButton.vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import Editor from '@/components/editor/Editor.vue'
import { useAuthz } from '@/lib/authz'
import { useMeta } from '@/lib/meta'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Home',
  components: {
    MaterialButton,
    MaterialCard,
    Editor
  },
  props: {
    topic: {
      type: String,
      required: false,
      default: 'Yleinen'
    }
  },
  setup (props) {
    const content = ref('')
    const title = ref('')
    const chosenTopic = ref(props.topic)
    const images = ref('')
    const { isAuthz, uid } = useAuthz()
    const { topics } = useMeta()

    function onInput (event: Event) {
      const target = event.target as HTMLElement
      content.value = target.innerHTML
    }

    const router = useRouter()

    const titlePlaceHolder = computed(() => {
      if (!title.value) {
        const elem = document.createElement('div')
        elem.innerHTML = content.value
        const textContent = elem.textContent
        if (!content.value || textContent === null) return 'Title'
        const end = textContent.length < 20 ? textContent.length : 20
        return textContent.substring(0, end) + '...'
      }
      return title.value
    })

    /**
     * Some of the message processing is tedious, or migth be impossible to implement to
     * editor directly --> do it here instead.
     */
    function postProcessContent (content: string): string {
      // Add links not found by editor (at the end of a line, at the beginning of a line)
      // @TODO: some of these might be findable by editor, like 'http://a\/n' f.ex.
      // const r = new RegExp('/(?<!("|>))https?:\\/\\/[a-zA-Z.]*/', 'gmu')
      const r = new RegExp('(<div>|<br>| |^)(https?:\\/\\/[a-zA-Z\\/_.-]*)( |<div>|</div>|<br>|$)', 'gmu')
      content = content.replace(r, (match, p1, p2, p3) => {
        return `${p1}<a href="${p2.trim()}">${p2.trim()}</a>${p3}`
      })
      return content
    }

    function post (): void {
      if (content.value.length < 1) return
      const c = postProcessContent(content.value)
      const db = firebase.firestore()
      const streamRef = db.collection('stream')
      let t: string = title.value
      if (!t) t = titlePlaceHolder.value
      streamRef.add(
        {
          title: t,
          author: uid.value,
          content: c,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          flowTime: firebase.firestore.FieldValue.serverTimestamp(),
          topic: chosenTopic.value,
          images: images.value
        }).then(() => {
        router.push('/stream/topic/' + chosenTopic.value.toLowerCase())
      })
    }

    return { isAuthz, post, onInput, content, chosenTopic, topics, title, titlePlaceHolder, images }
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
