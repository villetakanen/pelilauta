<template>
  <Dialog v-model="registrationIncomplete">
    <h1 class="title">
      {{ $t('registration.title') }}
    </h1>
  </Dialog>
</template>

<script lang="ts">
import { useAuth } from '@/state/authz'
import { defineComponent } from 'vue'
import Dialog from '../material/Dialog.vue'

export default defineComponent({
  components: { Dialog },
  setup () {
    const { registrationIncomplete } = useAuth()
    return { registrationIncomplete }
  }
})
</script>
