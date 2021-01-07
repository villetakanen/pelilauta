<template>
  <input
    class="materialTextfield"
    v-model="fieldValue"
    @blur="onUpdate"
  >
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'

export default defineComponent({
  name: 'MaterialInpuTextfield',
  props: {
    modelValue: { type: String, required: false, default: '' }
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
  border: 0
  height: 28px
  margin-top: 2px
  border-bottom: solid 1px $color-fill-primary-dark
  background-color: rgba($color-fill-primary-dark, 0.11)
  &:hover
    background-color: rgba($color-fill-primary-dark, 0.22)
  &:focus
    background-color: rgba($color-fill-primary-dark, 0.22)
  &.error
    border-bottom: solid 1px $color-fill-secondary
    background-color: rgba($color-fill-secondary, 0.33)
</style>
