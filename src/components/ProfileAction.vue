<template>
  <MaterialButton
    :action="reroute"
    icon
    class="profileButton"
  >
    <img
      v-if="!isAuthz || !profile.nick"
      src="../assets/avatar.svg"
      :alt="isAuthz"
    >
    <span v-if="isAuthz && !profile.photoURL">{{ profile.nick.substring(0,1) }}</span>
    <img
      v-if="isAuthz && profile.photoURL"
      :src="profile.photoURL"
      :alt="profile.nick"
      class="avatar-image"
    >
  </MaterialButton>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthz } from '../lib/authz'
import MaterialButton from './material/MaterialButton.vue'

export default defineComponent({
  components: {
    MaterialButton
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
  width: 42px
  height: 42px
  border-radius: 20px
  margin-top:2px
</style>
