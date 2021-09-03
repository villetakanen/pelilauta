<template>
  <div
    v-if="showMemberTools"
    id="inboxAction"
    class="chromaFocus"
    @click="reroute"
  >
    <Icon
      name="send"
      class="actionIcon"
      medium
      :class="{inactive: unreadCount < 1}"
    />
    <div
      v-if="unreadCount"
      class="inboxLenght"
    >
      {{ unreadCount }}
    </div>
  </div>
</template>

<script lang="ts">
import { useAuth } from '@/state/authz'
import { useInbox } from '@/state/inbox'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '../material/Icon.vue'

export default defineComponent({
  name: 'InboxAction',
  components: { Icon },
  setup () {
    const { showMemberTools } = useAuth()
    const router = useRouter()
    const { unreadCount } = useInbox()
    const reroute = () => {
      router.push('/profile/inbox')
    }
    return { unreadCount, showMemberTools, reroute }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/box-shadow.sass
@import @/styles/material-typography.sass

#inboxAction
  position: relative
  height: 40px
  width: 40px
  border-radius: 20px
  margin: 4px
  .actionIcon
    margin: 0
  .inactive
    opacity: 0.3
    transition: opacity 0.3s
  &:hover
    .inactive
      opacity: 1
  .inboxLenght
    @include TypeCaption()
    background-color: var(--chroma-primary-i)
    color: var(--chroma-primary-c)
    height: 16px
    width: auto
    position: absolute
    bottom: 0px
    right: 0px
    padding: 2px 8px
    text-align: center
    border-radius: 12px
    @include Rise2()
    pointer-events: none
</style>
