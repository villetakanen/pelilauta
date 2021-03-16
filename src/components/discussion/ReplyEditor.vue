<template>
  <div class="replyEditor">
    <div
      ref="editor"
      @paste="onPaste"
    />
  </div>
</template>

<script lang="ts">
import { ComponentPublicInstance, defineComponent, inject, onMounted, Ref, ref, watch } from 'vue'
import Quill from 'quill'
import { Quote } from '@/utils/contentFormat'
/**
 * A Vue 3 Wrapper for Quill Rich Text editor for thread replies.
 */
export default defineComponent({
  props: {
    content: { type: String, required: false, default: '' },
    disabled: { type: Boolean, required: false, default: false }
  },
  emits: [
    'update:content'
  ],
  setup (props, context) {
    const editor = ref<ComponentPublicInstance<HTMLInputElement>>()
    let quill:null|Quill = null
    const quotedContent = inject('quotedContent') as Ref<Quote>

    const onPaste = (event: ClipboardEvent) => {
      event.preventDefault()
      event.stopPropagation()
      if (quill) {
        const pasted = event.clipboardData?.getData('text/plain')
        // console.debug('paste', pasted)
        // force the pasted content through quill ingest pipelines
        quill.clipboard.dangerouslyPasteHTML(pasted || '')
      }
    }

    // We want to inject the Quill Editor only after this element has been
    // mounted, to have all the DOM we use from Quill, available
    onMounted(() => {
      // console.debug(editor.value)
      if (editor.value) {
        // If we have content at this point, inject it to editorfield
        // this could be done with v-once also, but that wound move the
        // init code to multiple places in the file: this way, it is all
        // in one place, and easily readable as a block.
        //
        // Please note: we react to v-model:content changes from
        // the parent a bit later
        if (props.content) {
          editor.value.innerHTML = props.content
        }
        // Init the quill-editor to the editor field, and start emitting
        // changes as vue-model-changes
        quill = new Quill(editor.value)
        quill.on('text-change', () => {
          context.emit('update:content', quill?.root.innerHTML)
        })
        // Reset field, when model is reset. Do not inject other
        // changes to the editor, to avoid contentEditable issues.
        watch(() => props.content, (value) => {
          if (!value) quill?.setText('')
        })
        // we need to handle disable prop with
        // quill.enable(boolean) instead of DOM attrs.
        watch(() => props.disabled, (value) => {
          quill?.enable(!value)
        })

        // Start watching for incoming Quote events. This never happens
        // at the initial load, so we do not use { immediate: true } on
        // the watch code
        watch(quotedContent, (quote) => {
          console.debug('watch2(() => quotedContent', quote)
          if (quill !== null && quote.content) {
            // see https://github.com/quilljs/quill/issues/2124
            quill.insertEmbed(0, 'blockquote', '', 'user')
            quill.insertText(0, quote.content, 'user')
            quill.insertText(0, quote.author + ': ', { bold: true }, 'user')
          }
        })

        //
      }
    })
    return { editor, onPaste }
  }
})
</script>