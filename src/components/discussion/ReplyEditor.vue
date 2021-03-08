<template>
  <div class="replyEditor">
    <div ref="editorField" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import Quill from 'quill'
/**
 * A Vue 3 Wrapper for thread reply editing field.
 */
export default defineComponent({
  props: {
    content: { type: String, required: false, default: '' },
    quotedContent: { type: String, required: false, default: '' }
  },
  emits: [
    'update:content'
  ],
  setup (props, context) {
    const editorField:ref<null|HTMLElement> = ref(null)
    // We want to inject the Quill Editor only after this element has been
    // mounted, to have all the DOM we use from Quill, available
    onMounted(() => {
      if (editorField.value !== null) {
        // If we have content at this point, inject it to editorfield
        // this could be done with v-once also, but that wound move the
        // init code to multiple places in the file: this way, it is all
        // in one place, and easily readable as a block.
        //
        // Please note: we do not react to changes in this model from
        // the parent component
        if (props.content) {
          editorField.value.innerHTML = props.content
        }
        // Init the quill-editor to the editor field, and start emitting
        // changes as vue-model-changes
        const quill = new Quill(editorField.value)
        quill.on('text-change', () => {
          context.emit('update:content', quill.root.innerHTML)
        })
        // Start watching for incoming Quote events. This never happens
        // at the initial load, so we do not use { immediate: true } on
        // the watch code
        watch(
          () => props.quotedContent,
          (quote) => {
            if (!quote) return
            quill.clipboard.dangerouslyPasteHTML(0, quote, 'user')
          })
      }
    })
  }
})
</script>
