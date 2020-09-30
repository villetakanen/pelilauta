<template>
  <MaterialButton
    :action="reroute"
    icon
  >
    <img v-if="!isAuthz || !profile.nick"
      src="../assets/avatar.svg"
      :alt="isAuthz"
    />
    <span v-if="isAuthz && profile.nick">{{profile.nick.substring(0,1)}}</span>
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
      router.push('/about')
    }
    return { reroute, profile, isAuthz }
  }
})
</script>
