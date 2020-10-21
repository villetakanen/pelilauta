<template>
  <div class="editorCard">
    <!-- Title, topic: shown side by side on desktop, below each other on mobile -->
    <div class="toolbar toolbar-form">
      <div class="grow">
        <input
          v-model="title"
          class="material-textfield"
          type="text"
          :placeholder="titlePlaceholder"
        >
      </div>
      <select
        v-model="chosenTopic"
        name="topic"
        class="material-select"
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
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import ImageUploadBar from './ImageUploadBar.vue'
import { useMeta } from '@/lib/meta'
import { processContent } from './processors'
import { useStream, PostData, PostImage } from '@/lib/stream'
import { useAuthz } from '@/lib/authz'
import { useRouter } from 'vue-router'
import { useEditorDialog } from '@/lib/editor'

export default defineComponent({
  components: {
    ImageUploadBar
  },
  props: {
    threadid: { type: String, required: false, default: '' }
  },
  emits: ['close-dialog'],
  setup (props, context) {
    const router = useRouter()
    const { uid } = useAuthz()
    const { addPost } = useStream()
    const { visible, topic: edTopic, post } = useEditorDialog()

    const title = ref('')
    const titlePlaceholder = computed(() => {
      if (title.value.length > 0) return title.value
      let placeholder = 'Title'
      if (content.value.length > 0) {
        if (content.value.length > 11) placeholder = content.value.substring(0, 11)
        else placeholder = content.value
      }
      return placeholder
    })
    const chosenTopic = ref('Yleinen')
    const content = ref('')
    const images = ref(new Array<PostImage>())
    const { topics } = useMeta()

    function setEditorContent (el: HTMLElement) {
      const { update } = processContent(el.innerHTML)
      content.value = update
      // if (newImages) newImages.forEach((image) => { images.value.push(image) })
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

    /* watch(visible, (val) => {
      if (!val) return
      if (edTopic) chosenTopic.value = edTopic.value
      if (post) {
        content.value = post.value.data.content
      }
    }) */

    return { title, chosenTopic, topics, content, onPaste, onInput, images, cancel, send, titlePlaceholder }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
@import @/styles/layout.sass
@import @/styles/include-media.scss

.editorCard
  margin: 0
  padding: 8px
  display: relative
  .material-textfield,.material-select,.editorContent
    border-bottom: solid 1px $color-secondary-dark
  .editorContent
    @include TypeBody2()
    padding: 8px
    height: 264px
    background-color: $color-base-dark
    overflow-y: scroll
    &:hover, &:focus
      background-color: $color-base-darker

::-webkit-scrollbar
  width: 0px  // Remove scrollbar space */
  background: transparent

@include media('>tablet')
  .editorContent
    width: 638px

@include media('<tablet')
  .editorCard
    padding: 0px
    margin: 0px
    box-shadow: none
    .editor-actions
      position: fixed
      bottom: 0
      right: 0
      padding: 8px
    .toolbar
      margin-top: 0
      .grow
        margin-left: 0
    .toolbar.toolbar-form
      display: block
    .material-select
      width: 100%
</style>
