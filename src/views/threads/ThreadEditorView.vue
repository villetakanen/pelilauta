<template>
  <div class="threadEditorView singleColumnLayout">
    <DocumentEditor />
  </div>
</template>

<script lang="ts">
import DocumentEditor from '@/components/editor/DocumentEditor.vue'
import { defineComponent } from 'vue'

/**
 * View component for the Tread Editor
 *
 * Initializes all the required route entities and loads the custom rich-text-parchment based Quill.
 *
 * @TODO: refactor view at @/views/pelilauta/EditThread.vue to this view
 */
export default defineComponent({
  name: 'ThreadEditorView',
  components: {
    DocumentEditor
  },
  setup () {
  }
})
</script>

<style lang="sass" scoped>

</style>
