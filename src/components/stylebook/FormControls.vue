<template>
  <Column class="formContols">
    <h1>Forms</h1>
    <Toggle
      v-model="error"
      label="Set fields to error state"
    />
    <div
      class="toolbar"
      style="margin-top:8px"
    >
      <Select
        v-model="selectKey"
        label="A Select input"
        :opts="selectOps"
        :error="error"
        name="ExampleSelect"
      />
      <p>key: <span class="code">{{ selectKey }}</span></p>
    </div>
    <div
      class="toolbar"
      style="margin-top:8px"
    >
      <Textfield
        v-model="textFieldValue"
        label="A Textfield input"
        :error="error"
      />
      <p>value: <span class="code">{{ textFieldValue }}</span></p>
    </div>
  </Column>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Select from '../form/Select.vue'
import Column from '../layout/Column.vue'
import Textfield from '../form/Textfield.vue'
import Toggle from '../material/Toggle.vue'

export default defineComponent({
  name: 'FromControls',
  components: { Column, Select, Toggle, Textfield },
  setup () {
    const error = ref(false)

    const selectOps = new Map<string, string>()
    const selectKey = ref('one')
    selectOps.set('one', 'Option one')
    selectOps.set('two', 'Option two')

    const textFieldValue = ref('')

    return { selectKey, selectOps, error, textFieldValue }
  }
})
</script>
