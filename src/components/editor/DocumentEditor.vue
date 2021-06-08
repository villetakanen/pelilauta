<template>
  <div class="documentEditor">
    <div class="toolbar editorToolbar">
      <ToolBarAction
        icon="head-1"
        :active="selectionFormats.get('header') === 3"
        @click="format('header', 3)"
      />
      <ToolBarAction
        icon="head-2"
        :active="selectionFormats.get('header') === 4"
        @click="format('header', 4)"
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
      <ToolbarLinkAction
        v-model:title="linkerTitle"
        v-model:url="linkerURL"
        :open="linkerURL && linkerURL.length > 0"
        @click="openLinker"
      />
      <Icon
        name="d6"
        medium
      />
      <div class="spacer" />
      <ToolBarAction
        icon="addAnImage"
        @click="toggleItalic"
      />
      <ToolBarAction
        icon="youtube"
        @click="toggleItalic"
      />
    </div>
    <div
      ref="editor"
      class="editorArea"
    />
    <div class="debugger">
      {{ selectionFormats }}
    </div>
  </div>
</template>

<script lang="ts">
import Quill from 'quill'
import { ComponentPublicInstance, defineComponent, onMounted, ref } from 'vue'
import { hoistClipboardConfig } from '@/utils/quill/clipboard'
import ToolBarAction from '../material/ToolBarAction.vue'
import Icon from '../material/Icon.vue'
import ToolbarLinkAction from './ToolbarLinkAction.vue'

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
    ToolBarAction,
    Icon,
    ToolbarLinkAction
  },
  props: {
    content: { type: String, required: false, default: '' }
  },
  setup (props) {
    const editor = ref<ComponentPublicInstance<HTMLInputElement>>()
    const linkerTitle = ref('')
    const linkerURL = ref('')
    let quill:null|Quill = null

    // We override quill internal selection controls with these
    // making us able to replace quill toolbar with custom vue
    // controlled toolbar. Essentially leaving only the complex
    // management of the div:ContentEditable element to Quill
    const selectionFormats = ref(new Map<string, boolean|number>())
    function format (f:string, l?: number) {
      if (l) {
        if (selectionFormats.value.get(f) === l) {
          selectionFormats.value.delete(f)
          quill?.format(f, false)
        } else {
          selectionFormats.value.set(f, l)
          quill?.format(f, l)
        }
      } else if (selectionFormats.value.has(f)) {
        selectionFormats.value.delete(f)
        quill?.format(f, false)
      } else {
        selectionFormats.value.set(f, true)
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
        selectionFormats.value = new Map<string, boolean|number>()
        if (!r) return
        Object.entries(quill?.getFormat(r) ?? {}).forEach((e) => {
          const [key, value] = e
          if (value) selectionFormats.value.set(key, typeof value === 'number' ? value : value as boolean)
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

    function openLinker () {
      linkerURL.value = quill?.getFormat(quill.getSelection() ?? undefined)?.link ?? ''
      console.log('openLinker', linkerTitle.value, linkerURL.value)
    }

    onMounted(() => {
      // We want to inject the Quill Editor only after this element has been
      // mounted, to have all the DOM we use from Quill available
      initializeEditor()
    })

    return { editor, format, selectionFormats, linkerTitle, linkerURL, openLinker }
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
