<template>
  <MaterialButton
    :action="reroute"
    icon
  >
    <img
      src="../assets/avatar.svg"
      alt="M"
    >
  </MaterialButton>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import MaterialButton from './material/MaterialButton.vue'

export default defineComponent({
  components: {
    MaterialButton
  },
  setup () {
    const router = useRouter()

    const reroute = () => {
      router.push('/about')
    }
    return { reroute }
  }
})
</script>
