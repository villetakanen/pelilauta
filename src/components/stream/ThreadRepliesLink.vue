<template>
  <div class="threadRepliesLink">
    <transition name="fade">
      <div
        v-if="newReplies"
        class="notificationPill"
      >
        <img src="@/assets/icons/pulse.svg">
        {{ $t('post.newRepliesNote') }}
      </div>
    </transition>
    <router-link :to="`/thread/${thread.id}/view`">
      {{ thread ? thread.replyCount + ' ' + $t('post.nOfReplies') : $t('post.more') }}
    </router-link>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { useAuth, useProfile } from '@/state/authz'
import { Thread } from '@/utils/firestoreInterfaces'

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
    const { showMemberTools } = useAuth()

    const newReplies = computed(() => (
      showMemberTools.value &&
      !hasSeen(props.thread.id, props.thread.flowTime) &&
      props.thread.replyCount > 0
    ))

    return { newReplies }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.notificationPill
  height: 22px
  margin: 0 8px
  padding: 0px 8px
  background-color: var(--color-fill-primary)
  border-radius: 16px
  display: inline-block
  line-height: 20px
  @include TypeColor('inverse high')
  img
    height: 16px
    vertical-align: middle
</style>
