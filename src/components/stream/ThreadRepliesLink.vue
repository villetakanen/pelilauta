<template>
  <transition name="fade">
    <div
      v-if="!isAnonymous && hasNotSeen"
      class="notificationPill"
    >
      <img src="@/assets/icons/pulse.svg">
      {{ $t('post.newRepliesNote') }}
    </div>
  </transition>
  <router-link :to="`/stream/view/${thread.id}`">
    {{ thread ? thread.replyCount + ' ' + $t('post.nOfReplies') : $t('post.more') }}
  </router-link>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { Thread } from '@/state/threads'
import { useAuthState, useProfile } from '@/state/authz'

export default defineComponent({
  name: 'ThreadRepliesLink',
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    }
  },
  setup (props) {
    const { hasSeen } = useProfile()
    const { isAnonymous } = useAuthState()
    const hasNotSeen = computed(() => (!hasSeen(props.thread.id, props.thread.flowTime)))

    return { hasNotSeen, isAnonymous }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.notificationPill
  height: 22px
  margin: 0 8px
  padding: 0px 8px
  background-color: $color-fill-primary
  color: $color-dark-font-high
  border-radius: 16px
  display: inline-block
  line-height: 20px
  img
    height: 16px
    vertical-align: middle
</style>
