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
eid          <div class="post-action">
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
        <EditorCard @close-dialog="dialog=false" />

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
import { defineComponent, computed } from 'vue'
import { useEditorDialog } from '@/lib/editor'
import EditorCard from '@/components/editor/EditorCard.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'

export default defineComponent({
  name: 'EditorDialog',
  components: {
    EditorCard,
    MaterialButton
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

    const dialog = computed({
      get: () => (props.modelValue || visible),
      set: (value) => {
        context.emit('update:modelValue', value)
        hideEditor()
      }
    })

    const publish = () => {
      console.log('publish, no-op')
    }

    return { dialog, hideEditor, publish }
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

@include media('<tablet')
  .editor-dialog-container
    background-color: $color-base-dark
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
