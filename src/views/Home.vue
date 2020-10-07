<template>
  <MaterialFab
    v-if="isAuthz"
    text="New post"
    to="/stream/post"
  >
    <img
      src="@/assets/add.svg"
      alt="new comment"
    >
  </MaterialFab>
  <Stream />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuthz } from '@/lib/authz'
import Stream from '@/components/stream/Stream.vue'
import MaterialFab from '@/components/material/MaterialFab.vue'

export default defineComponent({
  name: 'Home',
  components: {
    Stream,
    MaterialFab
  },
  setup () {
    const { isAuthz } = useAuthz()
    return { isAuthz }
  }
})
</script>
