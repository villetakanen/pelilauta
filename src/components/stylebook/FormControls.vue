<template>
  <Column class="formContols">
    <h1>Forms</h1>
    <p>
      And other input components.
    </p>
    <h2>Input fields</h2>
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

    <h2>Buttons</h2>
    <Button @action="alert">
      An Alert Button
    </Button>
    <Button
      disabled
      @action="alert"
    >
      A Disabled Alert
    </Button>
    <Button
      secondary
      :working="working"
      @click="working=!working"
    >
      Secondary + Async
    </Button>
    <Button
      secondary
      disabled
    >
      Secondary + Disabled
    </Button>
    <Button tertiary>
      Tertiary
    </Button>
    <Button
      tertiary
      disabled
    >
      Tertiary + Disabled
    </Button>
  </Column>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Select from '../form/Select.vue'
import Column from '../layout/Column.vue'
import Textfield from '../form/Textfield.vue'
import Toggle from '../material/Toggle.vue'
import Button from '../form/Button.vue'
export default defineComponent({
  name: 'FromControls',
  components: { Column, Select, Toggle, Textfield, Button },
  setup () {
    const error = ref(false)
    const selectOps = new Map<string, string>()
    const selectKey = ref('one')
    selectOps.set('one', 'Option one')
    selectOps.set('two', 'Option two')
    const textFieldValue = ref('')
    function alert () {
      window.alert('An annoying test functionality')
    }
    const working = ref(false)
    return { selectKey, selectOps, error, textFieldValue, alert, working }
  }
})
</script>
