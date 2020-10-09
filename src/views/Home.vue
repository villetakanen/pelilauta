<template>
  <teleport to="body">
    <MaterialFab
      v-if="showStreamActions"
      text="New post"
      to="/stream/post"
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
import { defineComponent } from 'vue'
import Stream from '@/components/stream/Stream.vue'
import MaterialFab from '@/components/material/MaterialFab.vue'
import { useMeta } from '@/lib/meta'

export default defineComponent({
  name: 'Home',
  components: {
    Stream,
    MaterialFab
  },
  setup () {
    const { showStreamActions } = useMeta()
    return { showStreamActions }
  }
})
</script>
