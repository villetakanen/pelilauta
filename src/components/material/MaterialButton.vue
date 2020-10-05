<template>
  <button
    v-ripple
    :class="buttonClasses"
    @click="clicked"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    fab: {
      type: String,
      required: false,
      default: undefined
    },
    icon: {
      type: [String, Boolean],
      required: false,
      default: undefined
    },
    text: {
      type: [String, Boolean],
      required: false,
      default: undefined
    },
    action: {
      type: Function,
      required: false
    }
  },
  setup (props) {
    const buttonClasses = ref(
      {
        'material-button': true,
        'material-fab': false,
        'material-button-text': false,
        'material-button-icon': false
      }
    )
    if (typeof props.text !== 'undefined') buttonClasses.value['material-button-text'] = true
    if (typeof props.fab !== 'undefined') buttonClasses.value['material-fab'] = true
    else if (typeof props.icon !== 'undefined') buttonClasses.value['material-button-icon'] = true

    const clicked = () => {
      if (props.action) props.action()
    }

    return { buttonClasses, clicked }
  }
})
</script>
