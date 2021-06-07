<template>
  <div class="documentEditor">
    Document editor skeleton
    <div ref="toolbar">
      <MaterialButton
        icon
        @click="toggleBold"
      >
        <Icon name="bold" />
      </MaterialButton>
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
import Icon from '../material/Icon.vue'
import MaterialButton from '../material/MaterialButton.vue'

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
    Icon,
    MaterialButton
  },
  props: {
    content: { type: String, required: false, default: '' }
  },
  setup (props) {
    const editor = ref<ComponentPublicInstance<HTMLInputElement>>()
    let quill:null|Quill = null

    function toggleBold () {
      if (quill) quill.format('bold', true)
    }

    function initializeEditor (): void {
      console.debug('DocumentEditor', 'initializeEditor')

      if (!editor.value) return

      // Init the quill-editor to the editor field
      quill = new Quill(editor.value)

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

    return { editor, toggleBold }
  }
})
</script>

<style lang="sass" scoped>
.editorArea
  background-color: #{'rgba(var(--chroma-secondary-g-rgb), 0.22)'}
</style>
