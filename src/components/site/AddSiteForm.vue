<template>
  <Column class="addSiteForm">
    <Textfield />
    <p><Toggle /></p>
  </Column>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Textfield from '../form/Textfield.vue'
import Column from '../layout/Column.vue'
import Toggle from '../material/Toggle.vue'

export default defineComponent({
  name: 'TextStyles',
  components: { Column, Toggle, Textfield },
  setup () {
    const name = ref('')
    const visible = ref('false')
    return { name, visible }
  }
})
</script>
