<template>
  <transition name="fade">
    <div
      v-if="newRepliesPill"
      class="notificationPill"
    >
      <img src="@/assets/icons/pulse.svg">
      {{ $t('post.newRepliesNote') }}
    </div>
  </transition>
  <router-link :to="`/stream/view/${threadid}`">
    {{ thread ? thread.replyCount + ' ' + $t('post.nOfReplies') : $t('post.more') }}
  </router-link>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { Thread } from '@/state/threads'
import { useProfile } from '@/state/authz'

export default defineComponent({
  name: 'ThreadRepliesLink',
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    }
  },
  setup (props) {
    const { profileMeta } = useProfile()
    const newRepliesPill = computed(() => {
      if (props.thread.replyCount < 1) return false
      const seen = profileMeta.value.seenThreads
      if (!seen || seen.size < 1) return false
      const seenThisAt = seen.get(props.thread.id)
      if (!seenThisAt) return true
      return seenThisAt.seconds < props.thread.flowTime.seconds
    })
    return { newRepliesPill }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.notificationPill
  height: 20px
  margin: 4px
  padding: 0px 8px
  background-color: $color-fill-primary-light
  color: $color-dark-font-high
  border-radius: 16px
  display: inline-block
  line-height: 20px
  img
    height: 16px
    vertical-align: middle
</style>
