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
            <img src="@/assets/action-close.svg">
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
              :placeholder="titlePlaceholder"
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
        <QuillEditor :toolbar="true" />

        <ImageUploadBar
          v-model="images"
        />

        <!-- Bottom bar for the dialog -->
        <div class="dialogBottomToolbar">
          <div class="grow blockAction">
            <MaterialButton
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
import { useMeta } from '@/lib/meta'
import { defineComponent, ref } from 'vue'
import ImageUploadBar from '../editor/ImageUploadBar.vue'
import MaterialButton from '../material/MaterialButton.vue'
import QuillEditor from '../quill/QuillEditor.vue'

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
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    function hide (): void {
      context.emit('update:modelValue', false)
    }
    const chosenTopic = ref(props.topic || 'Yleinen')
    const { topics } = useMeta()
    const images = ref(new Array<string>())
    return { hide, topics, chosenTopic, images }
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
  .ql-editor
    min-height: 292px
    background-color: #00233711
    &:hover
      background-color: #00233722
  .ql-toolbar
      border-left: none
      border-right: none
  .ql-container
    border: none
    border-bottom: solid 1px $color-fill-primary-dark
  .dialogBottomToolbar
    padding: 8px
    display: flex
    flex-direction: row-reverse

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
  .editorDialogContainer
    background-color: $color-fill-dark
</style>
