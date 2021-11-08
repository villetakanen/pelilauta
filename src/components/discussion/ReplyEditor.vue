<template>
  <div
    ref="editor"
    class="replyEditor"
  />
</template>

<script lang="ts">
import { ComponentPublicInstance, defineComponent, inject, onMounted, Ref, ref, watch } from 'vue'
import Quill from 'quill'
import { Quote } from '@/utils/contentFormat'
import { mentionsModule } from '@/utils/quill/mentionsModule'
import { hoistClipboardConfig } from '@/composables/useQuill'
import { logDebug } from '@/utils/eventLogger'

/**
 * A Vue 3 Wrapper for Quill Rich Text editor for thread replies.
 */
export default defineComponent({
  name: 'ReplyEditor',
  props: {
    content: { type: String, required: false, default: '' },
    debug: { type: Boolean, required: false, default: false },
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

    const modelContent = ref('')

    const config = {
      formats: [
        'bold',
        'strike',
        'underline',
        'italic',
        'image',
        'blockquote'
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

      hoistClipboardConfig(quill)

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

      // *** TODO CLEAR DOWN FROM HERE ****************************************

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
        if (quill && url) {
          const selection = quill.getSelection()
          logDebug('imageToEditor', url, selection)
          // https://quilljs.com/docs/api/#content
          quill.insertEmbed(selection?.index || 0, 'image', url, Quill.sources.USER)
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
