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
      v-model:selected="selectedImageIndex"
    />
    <div class="toolbar">
      <div class="spacer" />
      <MaterialButton text>
        Cancel
      </MaterialButton>
      <MaterialButton>Send</MaterialButton>
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

export default defineComponent({
  components: {
    MaterialCard,
    MaterialButton,
    ImageUploadBar
  },
  props: {
    postid: { type: String, required: false, default: '' }
  },
  setup () {
    const title = ref('')
    const chosenTopic = ref('Yleinen')
    const content = ref('')
    const images = ref(new Array<string>())
    images.value.push('https://artprojectsforkids.org/wp-content/uploads/2019/05/dragon-9.jpg')
    images.value.push('https://d279m997dpfwgl.cloudfront.net/wp/2018/05/dragon-1-1000x500.png')
    const { topics } = useMeta()
    const selectedImageIndex = ref(1)

    function setEditorContent (el: HTMLElement) {
      content.value = processContent(el.innerHTML)
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

    return { title, chosenTopic, topics, content, onPaste, onInput, images, selectedImageIndex }
  }
})
</script>

<style lang="sass">
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
