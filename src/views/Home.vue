<template>
  <div class="contentGrid">
    <Stream />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import Stream from '@/components/stream/Stream.vue'
import MaterialFab from '@/components/material/MaterialFab.vue'
import { useMeta } from '@/lib/meta'

export default defineComponent({
  name: 'Home',
  components: {
    Stream
  },
  setup () {
    const { showStreamActions } = useMeta()
    const editorDialog = ref(false)
    onMounted(() => {
      document.title = 'Pelilauta'
    })
    return { showStreamActions, editorDialog }
  }
})
</script>
