<template>
  <div
    class="FilterChip TypeButton"
    :class="{ active: active }"
    @click="onClick"
  >
    {{ label }}
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'FilterChip',
  props: {
    modelValue: {
      type: Boolean,
      required: false,
      default: false
    },
    label: {
      type: String,
      required: false,
      default: '...'
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const active = ref(props.modelValue)
    const onClick = () => {
      active.value = !active.value
      context.emit('update:modelValue', active.value)
    }
    return { active, onClick }
  }
})
</script>

<style lang="sass" scoped>
.FilterChip
  display: inline-block
  height: 32px
  padding: 0 18px
  box-sizing: border-box
  border-radius: 8px
  border: solid 1px var(--chroma-secondary-g)
  line-height: 32px
  margin-right: 12px
  margin-bottom: 16px
  &:hover
    cursor: pointer
    background-color: var(--chroma-secondary-i)
  &.active
    background-color: var(--chroma-secondary-h)
    border-color: var(--chroma-secondary-h)
    &:hover
      border-color: var(--chroma-secondary-g)

</style>
