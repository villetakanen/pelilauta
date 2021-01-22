<template>
  <div>
    <MaterialButton color="secondary">
      {{ $t('action.addAttachment') }}
    </MaterialButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MaterialButton from '../material/MaterialButton.vue'

export default defineComponent({
  name: 'AttachFileButton',
  components: {
    MaterialButton
  },
  setup () {
  }
})
</script>
