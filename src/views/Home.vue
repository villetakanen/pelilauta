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
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Stream from '@/components/stream/Stream.vue'
import MaterialFab from '@/components/material/MaterialFab.vue'
import { useMeta } from '@/lib/meta'
import { useEditorDialog } from '@/lib/editor'

export default defineComponent({
  name: 'Home',
  components: {
    Stream,
    MaterialFab
  },
  setup () {
    const { showStreamActions } = useMeta()
    const editorDialog = ref(false)
    const showDialog = () => {
      const { showEditor } = useEditorDialog()
      showEditor()
    }
    return { showStreamActions, editorDialog, showDialog }
  }
})
</script>
