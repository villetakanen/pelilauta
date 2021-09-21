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
      <div class="spacer" />
      <button class="ql-bold" />
      <button class="ql-italic" />
      <button class="ql-strike" />
      <button class="ql-underline" />
      <div class="spacer" />
      <button class="ql-wikilink" />
    </div>
    <div
      ref="editor"
    />
    <WikiLinkDialog />
  </div>
</template>

<script lang="ts">
import { ComponentPublicInstance, defineComponent, onMounted, ref, watch } from 'vue'
import Quill from 'quill'
import Delta from 'quill-delta'
import { wikiLinkModule } from '@/utils/quill/wikiLinkModule'
import WikiLinkDialog from './WikiLinkDialog.vue'

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
  components: { WikiLinkDialog },
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

    const config = {
      formats: [
        'bold',
        'strike',
        'underline',
        'italic',
        'wikilink',
        'header'
      ],
      modules: {
        wikilinks: true,
        toolbar: {
          container: '#rte-toolbar',
          handlers: {
            wikilink: () => {
              console.log('!')
              document.dispatchEvent(new Event('rte-wikilink-tool'))
            }
          }
        }
      }
    }

    // Implement and register module
    Quill.register('modules/wikilinks', wikiLinkModule)

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

<style lang="sass" scoped>
.rtEditor
  background-color: var(--color-b-j)
  min-height: 240px
</style>
