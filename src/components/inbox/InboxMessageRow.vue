<template>
  <div
    class="inboxMessageRow toolbar"
    :class="{ unred: notification.meta.new }"
  >
    <MaterialButton
      icon
      @click="markRed"
    >
      <Icon name="delete" />
    </MaterialButton>
    <div class="spacer">
      <router-link :to="`/thread/${notification.source.id}/view`">
        {{ notification.source.title }}
      </router-link>

      <div v-if="notification.source.type === 'thread.reply'">
        <AuthorLink :uid="notification.meta.author" /> {{ $t(notification.source.message || '...') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useInbox } from '@/state/inbox'
import { NotificationMessage } from '@/utils/firestoreInterfaces'
import { defineComponent, PropType } from 'vue'
import AuthorLink from '../author/AuthorLink.vue'
import Icon from '../material/Icon.vue'
import MaterialButton from '../material/MaterialButton.vue'

export default defineComponent({
  components: { AuthorLink, MaterialButton, Icon },
  props: {
    notification: {
      type: Object as PropType<NotificationMessage>,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  setup (props) {
    const { markRedByIndex } = useInbox()
    const markRed = () => {
      markRedByIndex(props.index)
    }
    return { markRed }
  }
})
</script>

<style lang="sass" scoped>
.unred
  background-color: var(--chroma-secondary-h)
</style>
