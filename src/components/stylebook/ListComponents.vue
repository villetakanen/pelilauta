<template>
  <Column class="ListComponents">
    <Toggle
      v-model="toggleVisibility"
      label="Toggle Focus"
    />
    <CollectionEmptyPane
      title="title"
      icon="keeper"
      message="message"
    >
      <Button>A Button!</Button>
    </CollectionEmptyPane>
  </Column>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import Button from '../form/Button.vue'
import Column from '../layout/Column.vue'
import Toggle from '../material/Toggle.vue'
import CollectionEmptyPane from '../material3/CollectionEmptyPane.vue'

export default defineComponent({
  components: { CollectionEmptyPane, Button, Toggle, Column },
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const toggleVisibility = computed({
      get: () => props.modelValue === 'ListComponents',
      set: (v:boolean) => {
        if (v) context.emit('update:modelValue', 'ListComponents')
        else context.emit('update:modelValue', '')
      }
    })
    return {
      toggleVisibility
    }
  }
})
</script>
