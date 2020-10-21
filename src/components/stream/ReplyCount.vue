<template>
  <div class="replyCount">
    <div
      v-if="newReplies"
      class="notificationPill"
    >
      <img src="@/assets/icons/pulse.svg">
      {{ $t('post.newRepliesNote') }}
    </div>
    <router-link :to="`/stream/view/${threadid}`">
      {{ thread ? thread.replyCount : '' }} {{ $t('post.nOfReplies') }}
    </router-link>
    <br>
    {{ thread ? thread.flowTime : '' }}
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useThreads, fetchThread } from '@/state/threads'
import { useAuthz } from '@/lib/authz'

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

    const { profile } = useAuthz()
    // const replyCount = computed(() => (1))
    const newReplies = computed(() => {
      if (!profile.value || !thread.value) return false
      if (profile.value.seenThreads.has(props.threadid)) {
        console.log(profile.value.seenThreads?.get(props.threadid)?.seconds, thread.value.flowTime.seconds)
        const lastSeen = profile.value.seenThreads.get(props.threadid)
        return !lastSeen || lastSeen.seconds < thread.value.flowTime.seconds
      }
      return true
    })
    return { newReplies, thread }
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
  background-color: $color-primary-light
  border-radius: 16px
  display: inline-block
  line-height: 20px
  img
    height: 16px
    vertical-align: middle

</style>
