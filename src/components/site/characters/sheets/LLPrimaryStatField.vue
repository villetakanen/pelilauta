<template>
  <div
    class="lLPrimaryStatField"
    :class="{ error: error, dirty: dirty}"
  >
    <label
      v-if="label"
      :for="name"
    >{{ label }}</label>
    <input
      v-model="fieldValue"
      :name="name"
      class="value"
      @input="onUpdate"
      @blur="onBlur"
    >
    <div class="bonus">
      +{{ Math.floor(fieldValue / 3) - 3 }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'

export default defineComponent({
  name: 'MaterialInpuTextfield',
  props: {
    modelValue: { type: Number, required: false, default: 10 },
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

<style lang="sass" scoped>
.lLPrimaryStatField
  position: relative
  display: block
  height: 108px
  width: 96px
  margin-bottom: 8px
  label
    position: absolute
    bottom: 0
    text-align: center
    display: block
    width: 100%
  input.value
    border-radius: 50%
    height: 24px
    width: 24px
    border: none
    background-color: var(--chroma-secondary-h)
    text-align: center
    font-weight: bold
    margin-left: 8px
  .bonus
    background-color: var(--chroma-secondary-c)
    color: white
    position: absolute
    width: 56px
    height: 44px
    top: 12px
    left: 22px
    z-index: -1
    padding-top: 16px
    box-sizing: border-box
    text-align: center
    font-size: 22px
  .bonus:after
    border-top: 22px solid var(--chroma-secondary-c)
    border-left: 28px solid transparent
    border-right: 28px solid transparent
    content: ""
    height: 0
    left: 0
    position: absolute
    top: 44px
    width: 0
</style>
