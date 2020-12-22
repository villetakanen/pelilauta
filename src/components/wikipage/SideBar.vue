<template>
  <div class="sidebar" style="position: relative">
    <MaterialButton
      :action="toggle"
      :icon="true"
      style="position:absolute;right:-8px;top:-8px"
    >
      x
    </MaterialButton>
    <h1>SideBar demo</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'

export default defineComponent({
  name: 'WikiSideBar',
  components: {
    MaterialButton
  },
  props: {
    modelValue: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const open = ref(props.modelValue)
    function toggle () {
      open.value = !open.value
      context.emit('update:modelValue', open.value)
    }
    return { toggle, open }
  }
})
</script>
