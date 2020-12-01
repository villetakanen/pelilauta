<template>
  <div class="replyCount">
    <transition name="fade">
      <div
        v-if="isAuthz && newReplies"
        class="notificationPill"
      >
        <img src="@/assets/icons/pulse.svg">
        {{ $t('post.newRepliesNote') }}
      </div>
    </transition>
    <router-link :to="`/stream/view/${threadid}`">
      {{ thread ? thread.replyCount + ' ' + $t('post.nOfReplies') : $t('post.more') }}
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useThreads, fetchThread } from '@/state/threads'
import { useAuthz } from '@/lib/authz'
import { useProfile } from '@/state/authz'

export default defineComponent({
  props: {
    threadid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { stream } = useThreads()

    const thread = computed(() => {
      const t = stream.value.find((val) => (val.id === props.threadid))
      if (t) return t
      fetchThread(props.threadid).then((val) => {
        return val
      })
    })

    const { isAuthz } = useAuthz()
    const { profileMeta } = useProfile()
    // const replyCount = computed(() => (1))
    const newReplies = computed(() => {
      if (!isAuthz) return false
      if (!profileMeta.value || !thread.value) return false
      if (profileMeta.value.seenThreads.has(props.threadid)) {
        const lastSeen = profileMeta.value.seenThreads.get(props.threadid)
        return !lastSeen || lastSeen.seconds < thread.value.flowTime.seconds
      }
      return true
    })
    return { newReplies, thread, isAuthz }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
@import @/styles/material-colors.sass

.notificationPill
  height: 20px
  margin: 4px
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
