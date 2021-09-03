<template>
  <div
    ref="editor"
    class="replyEditor"
  />
</template>

<script lang="ts">
import { ComponentPublicInstance, defineComponent, inject, onMounted, Ref, ref, watch } from 'vue'
import Quill from 'quill'
import Delta from 'quill-delta'
import { Quote } from '@/utils/contentFormat'
import { mentionsModule } from '@/utils/quill/mentionsModule'

function hoistClipboardConfig (quill:Quill) {
  quill.clipboard.addMatcher(Node.ELEMENT_NODE,
    function (node, delta) {
      return delta.compose(new Delta().retain(delta.length(),
        {
          color: false,
          background: false
        }))
    }
  )
}

/**
 * A Vue 3 Wrapper for Quill Rich Text editor for thread replies.
 */
export default defineComponent({
  name: 'ReplyEditor',
  props: {
    content: { type: String, required: false, default: '' },
    disabled: { type: Boolean, required: false, default: false },
    waiting: { type: Boolean, required: false, default: false }
  },
  emits: [
    'update:content',
    'mention'
  ],
  setup (props, context) {
    const editor = ref<ComponentPublicInstance<HTMLInputElement>>()
    let quill:null|Quill = null
    const quotedContent = inject('quotedContent') as Ref<Quote>
    const imageToEditor = inject('imageToEditor') as Ref<string>

    const config = {
      formats: [
        'bold',
        'strike',
        'underline',
        'italic'
      ],
      modules: {
        mention: true
      }
    }

    // Implement and register module
    Quill.register('modules/mention', mentionsModule)

    onMounted(() => {
      // We want to inject the Quill Editor only after this element has been
      // mounted, to have all the DOM we use from Quill, available
      initialize()
    })

    const initialize = () => {
      // Just sanity: if we try to initialize before the element has
      // been mounted, editor ref is null
      if (!editor.value) return

      // Init the quill-editor to the editor field
      quill = new Quill(editor.value, config)

      // If we have content at this point, inject it to editorfield
      // this could be done with v-once also, but that wound move the
      // init code to multiple places in the file: this way, it is all
      // in one place, and easily readable as a block.
      //
      // Please note: we react to v-model:content changes from
      // the parent a bit later
      if (props.content) {
        if (quill) quill.root.innerHTML = props.content
      }

      // Start emitting changes as vue-model-changes
      quill.on('text-change', () => {
        context.emit('update:content', quill?.root.innerHTML ?? '')
      })

      // *** TODO CLEAR DOWN FROM HERE ****************************************

      hoistClipboardConfig(quill)
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
        if (quill !== null && quote.content) {
          // see https://github.com/quilljs/quill/issues/2124
          quill.insertEmbed(0, 'blockquote', '', 'user')
          quill.insertText(0, quote.content, 'user')
          quill.insertText(0, quote.author + ': ', { bold: true }, 'user')
        }
      })

      // Start watching for incoming Image events. This never happens
      // at the initial load, so we do not use { immediate: true } on
      // the watch code
      watch(imageToEditor, (url) => {
        if (quill !== null && url) {
          // https://quilljs.com/docs/api/#content
          quill.insertEmbed(0, 'image', url)
        }
      })

      document.addEventListener('quill.mention', function (e: Event) {
        e.preventDefault()
        const ce = e as CustomEvent
        context.emit('mention', ce.detail)
      })
    }

    return { editor }
  }
})
</script>
