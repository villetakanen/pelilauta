<template>
  <Dialog v-model="registrationIncomplete">
    <Card>
      <h1 class="title">
        {{ $t('registration.title') }}
      </h1>
    </Card>
  </Dialog>
</template>

<script lang="ts">
import { useAuth } from '@/state/authz'
import { defineComponent } from 'vue'
import Card from '../layout/Card.vue'
import Dialog from '../material/Dialog.vue'

export default defineComponent({
  components: { Dialog, Card },
  setup () {
    const { registrationIncomplete } = useAuth()
    return { registrationIncomplete }
  }
})
</script>
