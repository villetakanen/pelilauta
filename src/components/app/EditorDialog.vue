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
              v-for="(topic) in topics"
              :key="topic.slug"
              :value="topic.slug"
            >
              {{ topic.title }}
            </option>
          </select>
        </div>

        <!-- Editor box-->
        <QuillEditor :toolbar="true" />
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { useMeta } from '@/lib/meta'
import { defineComponent, ref } from 'vue'
import QuillEditor from '../quill/QuillEditor.vue'

export default defineComponent({
  name: 'AppEditorDialog',
  components: { QuillEditor },
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
    return { hide, topics, chosenTopic }
  }
})
</script>

<style lang="sass" scoped>
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
