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
    const { isAuthz, profile } = useAuthz()

    const reroute = () => {
      if (!isAuthz.value) router.push('/login')
      else router.push('/profile')
    }
    return { reroute, profile, isAuthz }
  }
})
</script>

<style lang="sass" scoped>
.avatar-image
  height: 40px
  widht: 40px
  margin: 2px
  border-radius: 50%
</style>
