<template>
  <MaterialAction
    :action="reroute"
    image
    class="profileButton"
  >
    <img
      v-if="!isAuthz || !profile.nick"
      src="../assets/avatar.svg"
      :alt="isAuthz"
      class="avatar-image"
    >
    <span v-if="isAuthz && !profile.photoURL">{{ profile.nick.substring(0,1) }}</span>
    <img
      v-if="isAuthz && profile.photoURL"
      :src="profile.photoURL"
      :alt="profile.nick"
      class="avatar-image"
    >
  </MaterialAction>
</template>

<script lang="ts">
import { useProfile } from '@/state/authz'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthz } from '../lib/authz'
import MaterialAction from './material/MaterialAction.vue'

export default defineComponent({
  components: {
    MaterialAction
  },
  setup () {
    const router = useRouter()
    const { isAuthz } = useAuthz()
    const { profile } = useProfile()

    const reroute = () => {
      if (!isAuthz.value) router.push('/login')
      else router.push('/profile')
    }
    return { reroute, profile, isAuthz }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.avatar-image
  height: 40px
  widht: 40px
  margin-top: 2px
  border-radius: 50%
.material-action.profileButton
  background-color: $color-fill-primary-light
  margin-top: 2px
</style>
