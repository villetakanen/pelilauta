<template>
  <div
    class="ThreadLoves"
    :class="{ active: userLovesTheThread }"
    @click="toggleLove()"
  >
    <img
      src="@/assets/icons/love/loveIconBase.svg"
      class="loveIcon"
      alt=""
    >
    <img
      src="@/assets/icons/love/loveIcon.svg"
      class="loveIconActive"
      alt="love"
    >
    {{ thread.lovedCount }}
  </div>
</template>

<script lang="ts">
import { useAuth } from '@/state/authz'
import { loveThread, unloveThread } from '@/state/threads'
import { ThreadClass } from '@/state/threads/threads'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'ThreadLoves',
  components: { },
  props: {
    thread: {
      type: ThreadClass,
      required: true
    }
  },
  emits: ['refresh'],
  setup (props, context) {
    const { profileData, user } = useAuth()

    const userLovesTheThread = computed(() => profileData.value.lovedThreads?.includes(props.thread.id))

    async function toggleLove () {
      // no-op if the author is trying to love their own posts
      if (props.thread.author === user.value.uid) return
      // love/unlove
      if (userLovesTheThread.value) {
        await unloveThread(user.value.uid, props.thread.id)
      } else {
        await loveThread(user.value.uid, props.thread.id)
      }
      context.emit('refresh')
    }

    return { userLovesTheThread, toggleLove }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

div.ThreadLoves
  @include TypeBody2()
  font-weight: bold
  color: var(--chroma-secondary-d)
  background-color: var(--chroma-secondary-i)
  line-height: 20px
  height: 20px
  padding: 2px 12px
  padding-left: 32px
  border-radius: 12px
  margin: 0
  position: relative
  transition: all 0.3s
  .loveIcon, .loveIconActive
    position: absolute
    top: 2px
    left: 8px
    height: 18px
    transition: all 0.3s
    opacity: 0.22
  .loveIconActive
    opacity: 0
  &.active
    background-color: var( --chroma-alert-field-tint)
    .loveIconActive
      opacity: 1

</style>
