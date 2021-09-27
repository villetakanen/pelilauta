<template>
  <div
    class="Select"
    :class="{ error: error }"
  >
    <select
      v-model="value"
      :name="name"

      @change="onChange"
    >
      <option
        v-for="t in opts"
        :key="t[0]"
        :value="t[0]"
      >
        {{ t[1] }}
      </option>
    </select>
    <label
      v-if="label"
      :for="name"
    >{{ label }}</label>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, PropType } from 'vue'

export default defineComponent({
  name: 'MaterialSelect',
  props: {
    // Required Props
    name: { type: String, required: true },
    opts: { type: Map as PropType<Map<string, string>>, required: true },
    // modelValue props
    modelValue: { type: String, required: false, default: '' },
    // Optional props
    label: { type: String, required: false, default: '' },
    error: { type: Boolean, required: false, default: false }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const value = ref(props.modelValue)

    watch(() => props.modelValue, (val) => {
      value.value = val
    })

    function onChange () {
      context.emit('update:modelValue', value.value)
    }

    return { value, onChange }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
@import @/styles/formcontrols.sass

div.Select
  @include FormField()
  display: inline-block
  vertical-align: middle
  position: relative
  border-top-right-radius: 12px
  margin: 3px 0
  padding: 0 4px
  min-width: 170px
  select
    @include TypeBody2()
    background: none
    border: none
    height: 26px
    padding: 0
    margin: 0
    margin-top: 18px
    border: none
    color: var(--chroma-secondary-a)
    width: 100%

</style>
