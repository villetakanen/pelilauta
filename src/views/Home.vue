<template>
  <teleport to="body">
    <MaterialFab
      v-if="showStreamActions"
      :action="showDialog"
    >
      <img
        src="@/assets/add.svg"
        alt="new comment"
      >
    </MaterialFab>
  </teleport>
  <Stream />
  <EditorDialog v-model="editorDialog" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Stream from '@/components/stream/Stream.vue'
import MaterialFab from '@/components/material/MaterialFab.vue'
import { useMeta } from '@/lib/meta'
import EditorDialog from '@/components/editor/EditorDialog.vue'

export default defineComponent({
  name: 'Home',
  components: {
    Stream,
    MaterialFab,
    EditorDialog
  },
  setup () {
    const { showStreamActions } = useMeta()
    const editorDialog = ref(false)
    const showDialog = () => {
      editorDialog.value = true
    }
    return { showStreamActions, editorDialog, showDialog }
  }
})
</script>
