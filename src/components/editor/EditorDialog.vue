<template>
  <teleport to="body">
    <!-- Container for the dialog, visible on desktop -->
    <div
      v-show="modelValue"
      class="editor-dialog-container"
      @click.self="dialog=false"
    >
      <!-- Modal dialog, shown as full-page pane on mobile -->
      <div
        v-if="modelValue"
        class="editor-dialog"
      >
        <!-- Top bar for the dialog -->
        <div class="toolbar dialog-top-toolbar">
          <div
            class="action-icon"
            @click="dialog=false"
          >
            <img src="@/assets/action-back.svg">
          </div>
          <div class="grow">
            <h3>New post</h3>
          </div>
          <div class="post-action">
            <MaterialButton
              dark
              text
              :action="publish"
            >
              Post
            </MaterialButton>
          </div>
          <div
            class="action-icon-desktop"
            @click="dialog=false"
          >
            <img src="@/assets/action-close.svg">
          </div>
        </div>

        <!-- Editor fields and post preview card -->
        <!-- Title, topic: shown side by side on desktop, below each other on mobile -->
        <div class="toolbar-form">
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

        <Editor2
          v-model="content"
          @new-images="addImages"
        />

        <ImageUploadBar
          v-model="images"
        />

        <!-- Bottom bar for the dialog -->
        <div class="dialog-bottom-toolbar">
          <div class="grow block-action">
            <MaterialButton
              dark
              block
              :action="publish"
            >
              Post
            </MaterialButton>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useEditorDialog } from '@/lib/editor'
import ImageUploadBar from './ImageUploadBar.vue'
import Editor2 from './Editor2.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { PostData, useStream } from '@/lib/stream'
import { useMeta } from '@/lib/meta'
import { useAuthz } from '@/lib/authz'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'EditorDialog',
  components: {
    Editor2,
    MaterialButton,
    ImageUploadBar
  },
  props: {
    modelValue: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const { visible, hideEditor } = useEditorDialog()
    const { topics } = useMeta()
    const { addPost } = useStream()
    const { uid } = useAuthz()
    const router = useRouter()

    const content = ref('')
    const chosenTopic = ref('Yleinen')
    const images = ref(new Array<string>())

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

    const dialog = computed({
      get: () => (props.modelValue || visible),
      set: (value) => {
        if (!value) {
          content.value = ''
        }
        context.emit('update:modelValue', value)
        hideEditor()
      }
    })

    const publish = () => {
      const postData:PostData = {
        content: content.value,
        title: title.value ? title.value : titlePlaceholder.value,
        topic: chosenTopic.value,
        images: images.value.map((url) => ({ url: url }))
      }
      console.log('publish, ', postData)
      addPost(postData, uid.value).then((doc) => {
        context.emit('update:modelValue', false)
        hideEditor()
        router.push('/stream/view/' + doc.id)
      })
    }

    const addImages = (newImages: Array<string>) => {
      newImages.forEach((url) => { if (!images.value.includes(url)) images.value.push(url) })
    }

    return { dialog, hideEditor, publish, content, topics, chosenTopic, title, titlePlaceholder, images, addImages }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/layout.sass
@import @/styles/material-typography.sass
@import @/styles/include-media.scss

.editor-dialog-container
  position: fixed
  top: 0
  left: 0
  z-index: 50000
  width: 100%
  height: 100%
  margin: 0
  padding: 0
  background-color: rgba(40,70,100,0.5)
  .material-textfield, .material-select
    margin: 0
  .dialog-top-toolbar
    @include ElementColorSecondary()
    h3
      color: $color-front
      line-height: 48px
      margin-left: 8px
    .action-icon
      height: 48px
      width: 48px
      border-right: solid 1px $color-secondary-dark
      img
        height: 44px
        width: 44px
        margin: 2px
        opacity: 0.8

.post-action
  margin-top: 4px
  margin-right: 8px

@include media('>tablet')
  .editor-dialog
    position: fixed
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    width: 670px
    background-color: $color-base
    @include BoxShadow24()
    .action-icon
      display: none
    .action-icon-desktop
      height: 48px
      width: 48px
      border-left: solid 1px $color-secondary-dark
      img
        height: 36px
        width: 36px
        margin: 7px
        opacity: 0.8
  .dialog-bottom-toolbar
    padding: 8px
    text-align: right
  .toolbar-form
    display: flex
    padding: 8px
    .grow
      flex-grow: 1
      margin-right: 8px
    .material-select
      height: 31px

@include media('<tablet')
  .editor-dialog-container
    background-color: $color-base-dark
    .toolbar-form
      .material-textfield
        height: 24px
        padding: 8px 8px
      .material-select
        width: 100%
        margin-top: 4px
        height: 40px
        padding: 8px
    .editor-dialog
      padding: 0px
      margin: 0px
      position: relative
    .action-icon-desktop
      display: none
    .block-action
      box-sizing: border-box
      flex-grow: 1
      padding: 8px
</style>
