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
    <Button
      :disabled="dialogVisible"
      @click="sendSnack()"
    >
      Push a message to snacks
    </Button>
    <Dialog
      v-model="dialogVisible"
      label="Example Dialog"
    >
      <p>And then some text inside the dialog?</p>
      <template #footer>
        <Toolbar>
          <SpacerDiv />

          <Button>A Button in a Toolbar</Button>
        </Toolbar>
      </template>
    </Dialog>
  </Column>
</template>

<script lang="ts">
import { useSnack } from '@/composables/useSnack'
import { defineComponent, ref } from 'vue'
import Button from '../form/Button.vue'
import Column from '../layout/Column.vue'
import SpacerDiv from '../layout/SpacerDiv.vue'
import Toolbar from '../layout/Toolbar.vue'
import Dialog from '../material/Dialog.vue'

export default defineComponent({
  name: 'InteractiveElements',
  components: { Column, Button, Dialog, SpacerDiv, Toolbar },
  setup () {
    const dialogVisible = ref(true)
    function sendSnack () {
      const { pushSnack } = useSnack()
      pushSnack({ topic: 'Example snack message', message: 'at ' + new Date().toString(), action: () => { window.alert('hey!') }, actionMessage: 'alert?' })
    }
    return { dialogVisible, sendSnack }
  }
})
</script>
