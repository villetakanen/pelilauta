<template>
  <Column class="interactiveElements">
    <h1>Interactive Elements</h1>
    <h2>Dialog</h2>
    <p>We overuse dialog a bit, as it provides a convinient way to provide responsive wizard and selection tools</p>
    <Button
      :disabled="dialogVisible"
      @click="dialogVisible = true"
    >
      Open a Dialog
    </Button>
    <Dialog
      v-model="dialogVisible"
      label="Example Dialog"
    >
      ...
    </Dialog>
  </Column>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Button from '../form/Button.vue'
import Column from '../layout/Column.vue'
import Dialog from '../material/Dialog.vue'

export default defineComponent({
  name: 'InteractiveElements',
  components: { Column, Button, Dialog },
  setup () {
    const dialogVisible = ref(false)
    return { dialogVisible }
  }
})
</script>
