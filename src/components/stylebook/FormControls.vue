<template>
  <Column class="formContols">
    <h1>Forms</h1>
    <div class="toolbar">
      <p>Select field</p>
      <Select
        v-model="selectKey"
        label="Select?"
        :opts="selectOps"
      />
      <p>key: <span class="code">{{ selectKey }}</span></p>
    </div>
  </Column>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Select from '../form/Select.vue'
import Column from '../layout/Column.vue'

export default defineComponent({
  name: 'FromControls',
  components: { Column, Select },
  setup () {
    const selectOps = new Map<string, string>()
    const selectKey = ref('one')
    selectOps.set('one', 'Option one')
    selectOps.set('two', 'Option two')
    return { selectKey, selectOps }
  }
})
</script>
