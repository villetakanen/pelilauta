<template>
  <teleport to="body">
    <!-- Container for the dialog, visible on desktop -->
    <div
      v-if="modelValue"
      class="editorDialogContainer"
    >
      <!-- Modal dialog, shown as full-page pane on mobile -->
      <div
        class="editorDialog"
      >
        <!-- Top bar for the dialog -->
        <div class="toolbar dialogTopToolbar">
          <div class="grow">
            <h4>{{ $t('editorDialog.title') }}</h4>
          </div>
          <div
            class="actionIcon"
            @click="hide"
          >
            <img
              src="@/assets/action-close.svg"
              alt="close"
            >
          </div>
        </div>

        <!-- Editor fields and post preview card -->
        <!-- Title, topic: shown side by side on desktop, below each other on mobile -->
        <div class="toolbar form">
          <div class="grow">
            <input
              v-model="title"
              class="material-textfield"
              type="text"
              :placeholder="titleModel"
            >
          </div>
          <select
            v-model="chosenTopic"
            name="topic"
            class="material-select"
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

        <!-- Editor box-->
        <QuillEditor
          v-model="content"
          :toolbar="true"
        />

        <!-- Photo uploader -->
        <ImageUploadBar v-model="images" />

        <!-- Bottom bar for the dialog -->
        <div class="dialogBottomToolbar">
          <div class="grow blockAction">
            <MaterialButton
              dark
              block
              :action="publish"
            >
              {{ $t('action.send') }}
            </MaterialButton>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue'
import ImageUploadBar from './ImageUploadBar.vue'
import QuillEditor from '../quill/QuillEditor.vue'
import { useMeta } from '@/lib/meta'
import { Thread, PostData, createThread, PostImage, updateThread } from '@/state/threads'
import { useAuthState } from '@/state/authz'
import { useRouter } from 'vue-router'
import MaterialButton from '../material/MaterialButton.vue'
import { processContent } from '../editor/processors'
import { extractLinks } from '@/utils/contentFormat'

export default defineComponent({
  name: 'AppEditorDialog',
  components: { QuillEditor, ImageUploadBar, MaterialButton },
  props: {
    modelValue: {
      type: Boolean,
      required: false,
      default: true
    },
    topic: {
      type: String,
      required: false,
      default: ''
    },
    thread: {
      type: Object as PropType<Thread>,
      required: false,
      default: undefined
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const { topics } = useMeta()
    const { uid } = useAuthState()
    const router = useRouter()

    const chosenTopic = ref('')
    const content = ref('')
    const title = ref('')
    const images = ref(new Array<PostImage>())
    const update = ref(false)

    const titleModel = computed({
      get: () => {
        return title.value || '...'
      },
      set: (newTitle: string) => {
        title.value = newTitle
      }
    })

    function hide (): void {
      context.emit('update:modelValue', false)
    }

    function publish () {
      const { formattedContent } = extractLinks(content.value)
      const postData:PostData = {
        content: formattedContent,
        title: titleModel.value,
        topic: chosenTopic.value,
        images: images.value
      }
      if (!update.value) {
        createThread(uid.value, postData).then((slug: string) => {
          hide()
          router.push('/stream/view/' + slug)
        })
      } else {
        const post = props.thread
        post.data = { ...postData }
        updateThread(uid.value, post).then((slug: string) => {
          hide()
          router.push('/stream/view/' + slug)
        })
      }
    }

    if (props.topic) {
      chosenTopic.value = props.topic || 'Yleinen'
    } else if (props.thread) {
      console.log(props.thread)
      update.value = true
      chosenTopic.value = props.thread.data.topic || 'Yleinen'
      content.value = props.thread.data.content || ''
      title.value = props.thread.data.title || ''
      images.value = props.thread.data.images || new Array<PostImage>()
    }

    return { hide, topics, chosenTopic, images, publish, title, titleModel, content }
  }
})
</script>

<style lang="sass">
@import @/styles/material-colors.sass
@import @/styles/layout.sass
@import @/styles/material-typography.sass
@import @/styles/include-media.scss

.editorDialogContainer
  position: fixed
  top: 0
  left: 0
  z-index: 50000
  width: 100%
  height: 100%
  margin: 0
  padding: 0
  background-color: rgba($color-fill-dark, 0.44)
  .form
    padding: 8px
  .material-textfield, .material-select
    margin: 0
  .dialogBottomToolbar
    padding: 8px
    display: flex
    flex-direction: row-reverse
  .ql-container
    border: none
  .ql-editor
    min-height: 276px
    background-color: rgba($color-fill-dark, 0.08)
    border-bottom: solid 1px $color-fill-primary-dark
    &:hover
      background-color: rgba($color-fill-dark, 0.13)
  .ql-toolbar
    border: none
    border-bottom: solid 1px rgba($color-fill-dark, 0.4)
    border-top: solid 1px rgba($color-fill-dark, 0.4)
    padding: 0
    height: 38px
  .ql-formats:hover
    // background-color: rgba($color-fill-dark, 0.12)
  .ql-formats
    display: inline-block
    line-height: 24px
    margin: 0px
    padding: 6px

@include media('>=tablet')
  .editorDialog
    margin: 24px auto
    max-width: 876px
    background-color: $color-fill-light
    .dialogTopToolbar
      background-color: $color-fill-primary-light
      div
        padding: 8px
        height: 24px
        img
          height: 24px
          width: 24px

@include media('<tablet')
  .editorDialog
    background-color: $color-fill-light
    .dialogTopToolbar
      padding: 8px
      background-color: $color-fill-primary-light
      div
        padding: 8px
        height: 24px
        h4
          line-height: 24px
        img
          height: 24px
          width: 24px

@include media('<tablet')
  .editorDialogContainer
    background-color: $color-fill-dark
</style>
