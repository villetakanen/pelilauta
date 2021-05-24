<template>
  <div
    v-if="!isAnonymous"
    class="inboxAction"
    @click="reroute"
  >
    <Icon
      name="send"
      class="actionIcon"
      medium
      :class="{inactive: clicks < 1}"
    />
    <div
      v-if="clicks"
      class="inboxLenght"
    >
      {{ clicks }}
    </div>
  </div>
</template>

<script lang="ts">
import { useAuthState } from '@/state/authz'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '../material/Icon.vue'

export default defineComponent({
  name: 'InboxAction',
  components: { Icon },
  setup () {
    const { isAnonymous } = useAuthState()
    const clicks = ref(0)
    const router = useRouter()
    const reroute = () => {
      router.push('/profile/inbox')
    }
    return { clicks, isAnonymous, reroute }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/box-shadow.sass
@import @/styles/material-typography.sass

.inboxAction
  position: relative
  .inactive
    opacity: 0.3
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
