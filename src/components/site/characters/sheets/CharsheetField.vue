<template>
  <div
    class="charsheetField"
    :class="{ error: error, dirty: dirty}"
  >
    <label
      v-if="label"
      :for="name"
    >{{ label }}</label>
    <input
      v-model="fieldValue"
      :name="name"
      :class="{ header: header }"
      @input="onUpdate"
      @blur="onBlur"
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'

export default defineComponent({
  name: 'MaterialInpuTextfield',
  props: {
    modelValue: { type: String, required: false, default: '' },
    name: { type: String, required: false, default: 'input-' + Math.floor(Math.random() * 100000) },
    label: { type: String, required: false, default: '' },
    error: { type: Boolean, required: false, default: false },
    reactive: { type: Boolean, required: false, default: false },
    dirty: { type: Boolean, required: false, default: false }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const fieldValue = ref(props.modelValue)

    watch(() => props.modelValue, (val) => {
      fieldValue.value = val
    })

    function onUpdate () {
      if (!props.reactive) context.emit('update:modelValue', fieldValue.value)
    }
    function onBlur () {
      if (props.reactive) context.emit('update:modelValue', fieldValue.value)
    }

    return { fieldValue, onUpdate, onBlur }
  }
})
</script>
