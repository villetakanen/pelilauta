<template>
  <div
    class="repliesCardToolbarLink"
    :class="{
      alert: newRepliesInThread
    }"
  >
    <router-link :to="`/thread/${thread.id}/view/from/${showRepliesAfter}`">
      {{ thread ? thread.replyCount + ' ' + $t('post.nOfReplies') : $t('post.more') }}
    </router-link>
  </div>
</template>

<script lang="ts">
import { useAuth, useProfile } from '@/state/authz'
import { Thread } from '@/utils/firestoreInterfaces'
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    }
  },
  setup (props) {
    const { anonymousSession } = useAuth()
    const { seenFrom, profileMeta } = useProfile()
    const showRepliesAfter = computed(() => {
      if (anonymousSession.value) return 0
      return seenFrom(props.thread.id)
    })
    const newRepliesInThread = computed(() => {
      if (anonymousSession.value) return false
      if (props.thread.flowTime) {
        if (
          profileMeta.value.allThreadsSeenSince &&
          props.thread.flowTime.seconds > profileMeta.value.allThreadsSeenSince.seconds &&
          showRepliesAfter.value > 1 && props.thread.flowTime.seconds < showRepliesAfter.value
        ) {
          return true
        }
        return showRepliesAfter.value > 1 && props.thread.flowTime.seconds > showRepliesAfter.value
      }
      return false
    })
    return { newRepliesInThread, showRepliesAfter }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

.repliesCardToolbarLink
  @include TypeCaption()
  background-color: var(--chroma-secondary-i)
  line-height: 24px
  height: 24px
  padding: 0 12px
  border-radius: 12px
  a
    text-decoration: none
    color: var(--chroma-secondary-d)

.withSite
  .repliesCardToolbarLink
    background-color: var(--chroma-secondary-h)
  a
    color: var(--chroma-secondary-d)

.alert, .withSite .alert
  background: linear-gradient(140deg, var(--chroma-primary-i) 0%, var(--chroma-primary-h) 100%)
</style>
