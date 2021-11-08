<template>
  <div class="rtEditor">
    <div
      id="rte-toolbar"
      class="toolbar"
    >
      <button
        class="ql-header ql-h-1"
        value="1"
      />
      <button
        class="ql-header ql-h-2"
        value="2"
      />
      <SpacerDiv />
      <button class="ql-bold" />
      <button class="ql-italic" />
      <button class="ql-strike hideOnMobile" />
      <button class="ql-underline hideOnMobile" />
      <SpacerDiv />
      <button
        class="ql-list ql-list-ol hideOnMobile"
        value="ordered"
        type="button"
      />
      <button
        class="ql-list ql-list-ul hideOnMobile"
        value="bullets"
        type="button"
      />
      <SpacerDiv />
      <button class="ql-wikilink" />
      <button class="ql-image" />
    </div>
    <div
      ref="editor"
    />
    <WikiLinkDialog />
    <InsertMediaDialog />
  </div>
</template>

<script lang="ts">
import { ComponentPublicInstance, defineComponent, onMounted, ref, watch } from 'vue'
import Quill from 'quill'
import useQuill from '@/composables/useQuill'
import WikiLinkDialog from './WikiLinkDialog.vue'
import InsertMediaDialog from './InsertMediaDialog.vue'
import SpacerDiv from '../layout/SpacerDiv.vue'

/**
 * A Vue 3 Wrapper for Quill Rich Text editor for thread replies.
 */
export default defineComponent({
  name: 'ReplyEditor',
  components: { WikiLinkDialog, InsertMediaDialog, SpacerDiv },
  props: {
    content: { type: String, required: true },
    disabled: { type: Boolean, required: false, default: false },
    waiting: { type: Boolean, required: false, default: false },
    debug: { type: Boolean, required: false, default: false }
  },
  emits: [
    'update:content',
    'mention'
  ],
  setup (props, context) {
    const editor = ref<ComponentPublicInstance<HTMLInputElement>>()
    const modelContent = ref('')
    let quill:null|Quill = null

    onMounted(() => {
      // We want to inject the Quill Editor only after this element has been
      // mounted, to have all the DOM we use from Quill, available
      initialize()
    })

    const initialize = () => {
      // Just sanity: if we try to initialize before the element has
      // been mounted, editor ref is null
      if (!editor.value) {
        console.warn('initialize() can not be called before the onMounted lifecycle event.')
        return
      }

      // Init the quill-editor to the editor field
      quill = useQuill(editor.value)

      // If we have content at this point, inject it to editorfield
      // this could be done with v-once also, but that wound move the
      // init code to multiple places in the file: this way, it is all
      // in one place, and easily readable as a block.
      //
      // Please note: we react to v-model:content changes from
      // the parent a bit later
      // if (props.content) {
      if (quill) quill.root.innerHTML = props.content
      // }

      // Start emitting changes as vue-model-changes
      quill.on('text-change', () => {
        modelContent.value = quill?.root.innerHTML ?? ''
        if (props.debug) console.debug('ReplyEditor Emits:', modelContent.value)
        context.emit('update:content', modelContent.value)
      })

      // React to v-model changes
      watch(() => props.content, (value) => {
        // Nothing to do here!
        if (value === modelContent.value) return
        if (value === '<p><br></p>' && modelContent.value.length === 0) return

        // Debugs
        if (props.debug) console.debug('ReplyEditor replaces contents with:', value)

        // Reset editor, and push changes via clipboard-module
        quill?.setText('')
        quill?.clipboard.dangerouslyPasteHTML(value)
        modelContent.value = value
      }, {
        immediate: true
      })

      // we need to handle disable prop with
      // quill.enable(boolean) instead of DOM attrs.
      watch(() => props.disabled, (value) => {
        quill?.enable(!value)
      })
    }

    return { editor }
  }
})
</script>

<style lang="sass" scoped>
.toolbar
  display: flex
</style>
