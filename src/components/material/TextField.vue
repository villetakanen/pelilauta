<template>
  <div
    class="materialTextfield"
    :class="{withLabel: true && label }"
  >
    <input
      v-model="fieldValue"
      :name="name"
      @input="onUpdate"
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
    label: { type: String, required: false, default: '' }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const fieldValue = ref(props.modelValue)

    watch(() => props.modelValue, (val) => {
      fieldValue.value = val
    })

    function onUpdate () {
      context.emit('update:modelValue', fieldValue.value)
    }

    return { fieldValue, onUpdate }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
@import @/styles/layout.sass
@import @/styles/include-media.scss

.materialTextfield
  width: 100%
  border-bottom: solid 1px $color-fill-primary-dark
  background-color: rgba($color-fill-primary-dark, 0.11)
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
  label
    position: absolute
    left: 4px
    top: 14px
    width: 100%
    transition: 0.2s
    font-size: 14px
    z-index: -1
    line-height: 14px
    color: $color-fill-primary-dark
  &:hover
    background-color: rgba($color-fill-primary-dark, 0.22)
  &:focus
    background-color: rgba($color-fill-primary-dark, 0.22)
  .toSide, input:focus + label
      top: 4px
      left: 4px
      font-size: 10px
      line-height: 10px
  &.error
    border-bottom: solid 1px $color-fill-secondary
    background-color: rgba($color-fill-secondary, 0.33)
</style>
