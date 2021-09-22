<template>
  <div class="editableColumn">
    <div
      class="editorToggle"
      :class="{active: toggle }"
      @click="toggle=!toggle"
    >
      <Icon
        v-if="toggle"
        name="edit"
        medium
        style="margin: 0; padding: 2px"
      />
      <Icon
        v-if="!toggle"
        name="close"
        medium
        style="margin: 0; padding: 2px"
      />
    </div>
    <div
      v-if="toggle"
      class="columnContent"
    >
      <slot name="viewer" />
    </div>
    <div
      v-if="!toggle"
      class="columnContent"
    >
      <slot name="editor" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import Icon from '../material/Icon.vue'

export default defineComponent({
  components: { Icon },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const toggle = ref(!props.modelValue)
    watch(toggle, (t) => {
      context.emit('update:modelValue', t)
    })
    return { toggle }
  }
})
</script>

<style lang="sass" scoped>
.editableColumn
  position: relative
  padding-bottom: 8px
  .editorToggle
    background-color: var(--color-b-j)
    float: right
    border-radius: 0 8px 0 8px
    height: 40px
    width: 40px
  .columnContent
    padding: 8px
</style>
