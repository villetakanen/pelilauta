<template>
  <div
    class="inboxMessageRow toolbar"
    :class="{ unred: notification.meta.new }"
    @click="markRed"
  >
    <div class="spacer">
      <router-link :to="`/thread/${notification.source.id}/view`">
        {{ notification.source.title }}
      </router-link>

      <div
        v-if="notification.source.type === 'thread.reply' || notification.source.type === 'thread.reply.mention'"
        class="caption"
      >
        <AuthorTag :uid="notification.meta.author || ''" /> {{ $t(notification.source.message || '...') }}
      </div>
    </div>
    <Icon
      v-if="notification.meta.new"
      name="lightbulb"
      medium
    />
  </div>
</template>

<script lang="ts">
import { useInbox } from '@/state/inbox'
import { NotificationMessage } from '@/utils/firestoreInterfaces'
import { defineComponent, PropType } from 'vue'
import AuthorTag from '../author/AuthorTag.vue'
import Icon from '../material/Icon.vue'

export default defineComponent({
  components: { Icon, AuthorTag },
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
    // const router = useRouter()
    const markRed = () => {
      if (props.notification.meta.new) markRedByIndex(props.index)
      // router.push(`/thread/${props.notification.source.id}/view`)
    }
    return { markRed }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

.inboxMessageRow
  padding: 4px 8px
  border-radius: 8px
  margin-bottom: 4px
  transition: all 0.3s
  a
    text-decoration: none
  &:hover
    background-color: #{'rgba(var(--chroma-primary-c-rgba), 0.22)'}
  .caption
    @include TypeCaption()
    color: var(--chroma-secondary-e)
.unred
  background-color: #{'rgba(var(--chroma-primary-c-rgba), 0.11)'}
  &:hover
    background-color: #{'rgba(var(--chroma-primary-c-rgba), 0.44)'}
</style>
