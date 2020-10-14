<template>
  <MaterialCard class="editorCard">
    <h3>New Post</h3>
    <div class="toolbar">
      <div class="grow">
        <input
          v-model="title"
          class="material-textfield"
          type="text"
          placeholder="Title"
        >
      </div>
      <select
        v-model="chosenTopic"
        name="topic"
      >
        <option
          v-for="(topic) in topics"
          :key="topic.slug"
          :value="topic.slug"
        >
          {{ topic.title }}
        </option>
      </select>
    </div>
    <div
      v-once
      class="editorContent"
      :innerHTML="content"
      contenteditable="true"
      @paste="onPaste"
      @input="onInput"
    />
    <ImageUploadBar
      v-model="images"
    />
    <div class="toolbar">
      <div class="spacer" />
      <MaterialButton
        text
        :action="cancel"
      >
        Cancel
      </MaterialButton>
      <MaterialButton :action="send">
        Send
      </MaterialButton>
    </div>
  </MaterialCard>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import ImageUploadBar from './ImageUploadBar.vue'
import { useMeta } from '@/lib/meta'
import { processContent } from './processors'
import { useStream, PostData, PostImage } from '@/lib/stream'
import { useAuthz } from '@/lib/authz'
import { useRouter } from 'vue-router'

export default defineComponent({
  components: {
    MaterialCard,
    MaterialButton,
    ImageUploadBar
  },
  props: {
    postid: { type: String, required: false, default: '' }
  },
  emits: ['close-dialog'],
  setup (props, context) {
    const router = useRouter()
    const { uid } = useAuthz()
    const { addPost } = useStream()

    const title = ref('')
    const chosenTopic = ref('Yleinen')
    const content = ref('')
    const images = ref(new Array<PostImage>())
    const { topics } = useMeta()

    function setEditorContent (el: HTMLElement) {
      const { update, newImages } = processContent(el.innerHTML)
      content.value = update
      if (newImages) newImages.forEach((image) => { images.value.push(image) })
    }

    function onPaste (event: ClipboardEvent) {
      event.preventDefault()
      event.stopPropagation()
      const pasted = event.clipboardData?.getData('text/plain')
      const selection = window.getSelection()
      if (selection && pasted) {
        selection.getRangeAt(0).insertNode(document.createTextNode(pasted))
        selection.collapseToEnd()
      }
      setEditorContent(event.target as HTMLElement)
    }

    function onInput (event: Event) {
      setEditorContent(event.target as HTMLElement)
    }

    function cancel () {
      context.emit('close-dialog')
    }

    function send () {
      const postData: PostData = {
        content: content.value,
        title: title.value,
        topic: chosenTopic.value
      }
      addPost(postData, uid.value).then((doc) => {
        router.push(`/stream/view/${doc.id}`)
        context.emit('close-dialog')
      })
    }

    return { title, chosenTopic, topics, content, onPaste, onInput, images, cancel, send }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
@import @/styles/layout.sass

.editorCard
  padding: 8px
.editorContent
  width: 434px
  height: 168px
  background-color: $color-base-darker
  padding: 8px
.toolbar
  margin-top: 8px
</style>
