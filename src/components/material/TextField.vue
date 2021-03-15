<template>
  <div
    class="materialTextfield"
    :class="{withLabel: true && label, error: error }"
  >
    <input
      v-model="fieldValue"
      :name="name"
      :class="{ header: header }"
      @input="onUpdate"
      @blur="onBlur"
    >
    <label
      v-if="label"
      :for="name"
      :class="{toSide: true && fieldValue }"
    >{{ label }}</label>
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
    blur: { type: Boolean, required: false, default: false },
    header: { type: Boolean, required: false, default: false },
    error: { type: Boolean, required: false, default: false }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const fieldValue = ref(props.modelValue)

    watch(() => props.modelValue, (val) => {
      fieldValue.value = val
    })

    function onUpdate () {
      if (!props.blur) context.emit('update:modelValue', fieldValue.value)
    }
    function onBlur () {
      if (props.blur) context.emit('update:modelValue', fieldValue.value)
    }

    return { fieldValue, onUpdate, onBlur }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
@import @/styles/layout.sass
@import @/styles/include-media.scss

div.materialTextfield
  width: calc(100% - 8px)
  border-bottom: solid 1px var(--chroma-secondary-f)
  background-color: var(--chroma-secondary-i)
  padding-left: 4px
  padding-right: 4px
  position: relative
  margin-top: 4px
  margin-bottom: 4px
  &.withLabel
    input
      margin-top: 8px
  input
    border: 0
    height: 28px
    margin-top: 2px
    background: none
    width: 100%
    &.header
      @include TypeHeadline5()
      padding-top: 16px
  label
    position: absolute
    left: 4px
    top: 14px
    width: 100%
    transition: 0.2s
    font-size: 14px
    pointer-events: none
    line-height: 14px
    color: var(--chroma-secondary-e)
  &:hover
    background-color: var(--chroma-secondary-h)
    border-bottom: solid 1px var(--chroma-secondary-b)
  &:focus
    background-color: var(--chroma-secondary-h)
    border-bottom: solid 1px var(--chroma-secondary-b)
  .toSide, input:focus + label
      top: 4px
      left: 4px
      font-size: 10px
      line-height: 10px
  &.error
    border-bottom: solid 1px var(--chroma-alert)
    background-color: #{'rgba(var(--chroma-alert-rgb), 0.11)'}
    input
      color: var(--chroma-alert)
</style>
