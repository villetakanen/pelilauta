<template>
  <div>
    <router-link :to="`/thread/${notification.source.id}/view`">
      {{ notification.source.title }}
    </router-link>
  </div>
  <div v-if="notification.source.type === 'thread.reply'">
    <AuthorLink :uid="notification.meta.author" /> {{ $t(notification.source.message || '...') }}
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import AuthorLink from '../author/AuthorLink.vue'

export default defineComponent({
  components: { AuthorLink },
  props: {
    notification: {
      type: Object as PropType<Notification>,
      required: true
    }
  }
})
</script>
