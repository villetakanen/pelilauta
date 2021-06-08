<template>
  <div class="documentEditor">
    <div class="toolbar editorToolbar">
      <ToolBarAction
        icon="head-1"
        @click="toggleBold"
      />
      <ToolBarAction
        icon="head-2"
        @click="toggleBold"
      />
      <ToolBarAction
        icon="bold"
        :active="selectionFormats.has('bold')"
        @click="format('bold')"
      />
      <ToolBarAction
        icon="italic"
        :active="selectionFormats.has('italic')"
        @click="format('italic')"
      />
      <div class="spacer" />
      <ToolBarAction
        icon="add-link"
        @click="toggleItalic"
      />
      <ToolBarAction
        icon="addAnImage"
        @click="toggleItalic"
      />
      <ToolBarAction
        icon="youtube"
        @click="toggleItalic"
      />
      <div class="spacer" />
      <ToolBarAction
        icon="equalizer"
      />
    </div>
    <div
      ref="editor"
      class="editorArea"
    />
    <div class="debugger">
      ...
    </div>
  </div>
</template>

<script lang="ts">
import Quill from 'quill'
import { ComponentPublicInstance, defineComponent, onMounted, ref } from 'vue'
import { hoistClipboardConfig } from '@/utils/quill/clipboard'
import ToolBarAction from '../material/ToolBarAction.vue'

/**
 * View component for the Tread Editor
 *
 * Initializes all the required route entities and loads the custom rich-text-parchment based Quill.
 *
 * @TODO: refactor view at @/views/pelilauta/EditThread.vue to this view
 */
export default defineComponent({
  name: 'DocumentEditor',
  components: {
    ToolBarAction
  },
  props: {
    content: { type: String, required: false, default: '' }
  },
  setup (props) {
    const editor = ref<ComponentPublicInstance<HTMLInputElement>>()
    let quill:null|Quill = null

    const selectionFormats = ref(new Set<string>())

    function format (f:string) {
      if (selectionFormats.value.has(f)) {
        selectionFormats.value.delete(f)
        quill?.format(f, false)
      } else {
        selectionFormats.value.add(f)
        quill?.format(f, true)
      }
    }

    const config = {
      formats: [
        'bold'
      ]
    }

    function initializeEditor (): void {
      console.debug('DocumentEditor', 'initializeEditor')

      if (!editor.value) return

      // Init the quill-editor to the editor field
      quill = new Quill(editor.value, config)

      hoistClipboardConfig(quill)

      quill.on('selection-change', (r) => {
        selectionFormats.value = new Set<string>()
        if (!r) return
        Object.entries(quill?.getFormat(r) ?? {}).forEach((e) => {
          const [key, value] = e
          if (value) selectionFormats.value.add(key)
        })
        console.debug(selectionFormats.value)
      })

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
    }

    onMounted(() => {
      // We want to inject the Quill Editor only after this element has been
      // mounted, to have all the DOM we use from Quill available
      initializeEditor()
    })

    return { editor, format, selectionFormats }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/box-shadow.sass
.editorToolbar
 @include Rise2()
.editorArea
  background-color: #{'rgba(var(--chroma-secondary-g-rgb), 0.22)'}
</style>
