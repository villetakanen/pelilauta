<template>
  <label class="materialToggle">
    <input
      v-model="checked"
      type="checkbox"
    >
    <span class="switcher" />
    <span
      v-if="label"
      class="label"
    >{{ label }}</span>
  </label>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  props: {
    label: {
      type: String,
      required: false,
      default: ''
    },
    modelValue: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const checked = ref(props.modelValue)
    watch(checked, (value) => {
      context.emit('update:modelValue', value)
    })
    return { checked }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
@import @/styles/layout.sass

.materialToggle
  margin: 0 8px
  input[type="checkbox"]
    display: none
    visibility: hidden
  .label
    margin-left: 8px
  .switcher
    display: inline-block
    border-radius: 100px
    width: 35px
    height: 15px
    background-color: var(--chroma-secondary-h)
    position: relative
    -webkit-box-sizing: border-box
    -moz-box-sizing: border-box
    box-sizing: border-box
    vertical-align: middle
    cursor: pointer
    &:before
      content: ""
      display: block
      width: 20px
      height: 20px
      background-color: var(--chroma-secondary-i)
      box-shadow: 0 2px 6px var(--chroma-secondary-d)
      border-radius: 50%
      margin-top: -2.5px
      position: absolute
      top: 0
      left: 0
      -webkit-box-sizing: border-box
      -moz-box-sizing: border-box
      box-sizing: border-box
      margin-right: 0
      -webkit-transition: all 0.2s
      -moz-transition: all 0.2s
      -ms-transition: all 0.2s
      -o-transition: all 0.2s
      transition: all 0.2s
    &:active:before
      box-shadow: 0 1px 3px rgba(var(--chroma-primary-c-rgba), 0.6), 0 0 0 10px rgba(var(--chroma-primary-c-rgba), 0.3)
      transition: all, 0.1s
  input[type="checkbox"]:checked + .switcher
    background-color: var(--chroma-secondary-f)
    &:before
      left: 100%
      margin-left: -20px
      background-color: var(--chroma-secondary-c)

  &[disabled]:not([disabled="false"]) + .switcher
    background: blue !important

    &:active:before
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2) !important

    &:before
      background-color: #e2e2e2 !important
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2) !important

</style>
