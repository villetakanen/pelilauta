<template>
  <div class="documentEditor">
    <div class="toolbar">
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
        @click="toggleBold"
      />
      <ToolBarAction
        icon="italic"
        @click="toggleItalic"
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

    const config = {
      formats: [
        'bold'
      ]
    }

    function toggleBold () {
      if (quill) quill.format('bold', true)
    }
    function toggleItalic () {
      if (quill) quill.format('italic', true)
    }

    function initializeEditor (): void {
      console.debug('DocumentEditor', 'initializeEditor')

      if (!editor.value) return

      // Init the quill-editor to the editor field
      quill = new Quill(editor.value, config)

      hoistClipboardConfig(quill)

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

    return { editor, toggleBold, toggleItalic }
  }
})
</script>

<style lang="sass" scoped>
.editorArea
  background-color: #{'rgba(var(--chroma-secondary-g-rgb), 0.22)'}
</style>
