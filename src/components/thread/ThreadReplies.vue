<template>
  <div
    class="ThreadReplies"
    :class="{ active: newRepliesInThread }"
    @click="reroute(`/thread/${thread.id}/view/from/${showRepliesAfter}`)"
  >
    {{ thread.replyCount }}
    {{ $t('post.nOfReplies') }}
  </div>
</template>

<script lang="ts">
import { useUxActions } from '@/composables/useUxActions'
import { useAuth, useProfile } from '@/state/authz'
import { ThreadClass } from '@/state/threads/threads'
import { computed, defineComponent } from 'vue'
// import Icon from '../material/Icon.vue'

export default defineComponent({
  name: 'ThreadLoves',
  components: { },
  props: {
    thread: {
      type: ThreadClass,
      required: true
    }
  },
  setup (props) {
    const { reroute } = useUxActions()
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
          props.thread.flowTime > profileMeta.value.allThreadsSeenSince.seconds &&
          showRepliesAfter.value > 1 && props.thread.flowTime < showRepliesAfter.value
        ) {
          return true
        }
        return showRepliesAfter.value > 1 && props.thread.flowTime > showRepliesAfter.value
      }
      return false
    })
    return { newRepliesInThread, showRepliesAfter, reroute }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

div.ThreadReplies
  cursor: pointer
  @include TypeBody2()
  color: var(--chroma-secondary-d)
  background-color: var(--chroma-secondary-i)
  line-height: 20px
  height: 20px
  padding: 2px 12px
  border-radius: 12px
  margin: 0
  position: relative
  transition: all 0.3s
  &:hover
    color: var(--chroma-primary-d)
    background-color: var(--chroma-primary-d-field-tint)
  &.active
    background: linear-gradient(140deg, var(--chroma-primary-i) 0%, var(--chroma-primary-h) 100%)

</style>
