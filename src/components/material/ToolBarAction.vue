<template>
  <div
    class="toolbarAction"
    :class="{disabled: disabled, active: active }"
  >
    <Icon
      :name="icon"
      medium
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Icon from './Icon.vue'

export default defineComponent({
  components: { Icon },
  props: {
    icon: {
      type: String,
      required: false,
      default: ''
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    active: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup () {
    const clicked = ref(false)
    return { clicked }
  }
})
</script>

<style lang="sass" scoped>
.toolbarAction
  transition: background-color 300ms
  &:hover
    background-color: #{'rgba(var(--chroma-primary-c-rgba), 0.44)'}
  &.active
    background-color: #{'rgba(var(--chroma-primary-c-rgba), 0.22)'}
  &:active
    background-color: var(--chroma-clear)
.toolbarAction+.toolbarAction
  border-left: solid 1px var(--chroma-primary-c)
</style>
