<template>
  <div class="toolbar">
    <LoveAction
      class="inline"
      :loved="loves"
      :action="toggleLove"
    />
    <div v-if="thread.lovedCount > 0">
      {{ thread.lovedCount }}
    </div>

    <div class="spacer" />
    <div>
      <ThreadRepliesLink :thread="thread" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { loveThread, unloveThread } from '@/state/threads'
import ThreadRepliesLink from './ThreadRepliesLink.vue'
import LoveAction from '@/components/app/LoveAction.vue'
import { useAuth, useProfile } from '@/state/authz'
import { Thread } from '@/utils/firestoreInterfaces'

export default defineComponent({
  name: 'ThreadCardTailer',
  components: {
    ThreadRepliesLink,
    LoveAction
  },
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    }
  },
  emits: ['updated'],
  setup (props, context) {
    const { profileMeta } = useProfile()
    const { user } = useAuth()

    const loves = computed(() => {
      if (typeof profileMeta.value.lovedThreads === 'undefined') return false
      return profileMeta.value.lovedThreads.includes(props.thread.id)
    })

    async function toggleLove () {
      // no-op if the author is trying to love their own posts
      if (props.thread.author === user.value.uid) return
      // love/unlove
      if (loves.value) {
        return unloveThread(user.value.uid, props.thread.id).then(() => {
          context.emit('updated')
        })
      } else {
        return loveThread(user.value.uid, props.thread.id).then(() => {
          context.emit('updated')
        })
      }
    }

    return { loves, toggleLove }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
.spaced
  margin: 8px 0
  height: 48px
.toolbar
  margin-top: 16px
  div
    align-self: center
  p
    margin: 0
    padding: 0
.caption
  color: $color-font-disabled
.author
  margin: 0
  padding: 0
div.inline
  display: inline-block
</style>
