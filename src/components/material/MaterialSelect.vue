<template>
  <div class="materialFormField">
    <div
      class="materialSelect"
      :class="{ withLabel: true && label }"
    >
      <select
        v-model="fieldValue"
        :name="name"
        @change="onChange"
      >
        <option value="">
          -
        </option>
        <option
          v-for="(t) in opts"
          :key="t.key"
          :value="t.key"
        >
          {{ t.value }}
        </option>
      </select>
      <label
        v-if="label"
        :for="name"
        :class="{toSide: true && fieldValue }"
      >{{ label }}</label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, PropType } from 'vue'

export default defineComponent({
  name: 'MaterialSelect',
  props: {
    modelValue: { type: String, required: false, default: '' },
    name: { type: String, required: false, default: 'input-' + Math.floor(Math.random() * 100000) },
    label: { type: String, required: false, default: '' },
    opts: { type: Array as PropType<Array<Record<string, string>>>, required: false, default: [{ key: '-', value: '-' }] }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const fieldValue = ref(props.modelValue)

    watch(() => props.modelValue, (val) => {
      fieldValue.value = val
    })

    function onChange () {
      console.log('update:modelValue', fieldValue.value)
      context.emit('update:modelValue', fieldValue.value)
    }

    return { fieldValue, onChange }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
@import @/styles/layout.sass
@import @/styles/include-media.scss

.materialSelect
  position: relative
  padding: 0
  margin: 0
  select
    background: none
    border: none
    min-width: 180px
  label
    position: absolute
    left: 4px
    top: 14px
    width: 100%
    transition: 0.2s
    font-size: 14px
    pointer-events: none
    line-height: 14px
    color: $color-fill-primary-dark
  .toSide, input:focus + label
      top: 0px
      left: 4px
      font-size: 10px
      line-height: 10px
  &.error
    border-bottom: solid 1px $color-fill-secondary
    background-color: rgba($color-fill-secondary, 0.33)
</style>