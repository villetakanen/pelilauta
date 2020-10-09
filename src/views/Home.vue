<template>
  <teleport to="body">
    <MaterialFab
      v-if="canPost"
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
import { defineComponent, computed } from 'vue'
import { useAuthz } from '@/lib/authz'
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
    const { isAuthz, uid } = useAuthz()
    const { isFrozen } = useMeta()

    const canPost = computed(() => {
      return isAuthz && !isFrozen(uid.value)
    })

    return { canPost }
  }
})
</script>
