<template>
  <div
    class="textfield"
    :class="{withLabel: true && label, error: error, onDark: dark }"
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
  name: 'Textfield',
  props: {
    modelValue: { type: String, required: false, default: '' },
    name: { type: String, required: false, default: 'input-' + Math.floor(Math.random() * 100000) },
    label: { type: String, required: false, default: '' },
    blur: { type: Boolean, required: false, default: false },
    header: { type: Boolean, required: false, default: false },
    error: { type: Boolean, required: false, default: false },
    dark: { type: Boolean, required: false, default: false }
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
@import @/styles/material-typography.sass
@import @/styles/formcontrols.sass

div.toolbar
  div.textfield
    width: auto
    flex-grow: 1

div.textfield
  @include FormField()
  width: calc(100% - 8px)
  padding-left: 4px
  padding-right: 4px
  position: relative
  margin-top: 4px
  margin-bottom: 4px
  border-top-right-radius: 12px
  input
    @include TypeBody1()
    border: 0
    height: 24px
    margin-top: 2px
    background: none
    width: 100%
    padding-top:14px
    padding-bottom: 2px
    &.header
      @include TypeHeadline5()
      padding-top: 12px
      padding-bottom: 4px

div.textfield.onDark
  @include FormFieldOnDark()
</style>
