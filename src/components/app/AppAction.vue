<template>
  <Action
    dark
    :to="mekanismi ? 'mekanismi' : 'Home'"
  >
    <span v-if="!mekanismi">Pelilauta</span>
    <span v-else>Mekanismi</span>
  </Action>
</template>

<script lang="ts">
import { ComputedRef, defineComponent, inject } from 'vue'
import Action from '../material/Action.vue'

export default defineComponent({
  components: { Action },
  setup () {
    const mekanismi = inject('appMode') as ComputedRef<boolean>
    return { mekanismi }
  }
})
</script>
