<template>
  <teleport to="body">
    <div
      v-show="modelValue"
      class="material-dialog-container"
      @click.self="close"
    >
      <div
        v-if="modelValue"
        class="material-dialog-content"
      >
        <slot />
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'

export default defineComponent({
  name: 'Dialog',
  props: {
    modelValue: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    function close () {
      context.emit('update:modelValue', false)
    }
    provide('close', close)
    return { close }
  }
})
</script>

<style lang="sass">
@import @/styles/material-colors.sass
@import @/styles/layout.sass
@import @/styles/material-typography.sass
@import @/styles/include-media.scss

.material-dialog-container
  position: fixed
  top:0
  left:0
  width: 100%
  height: 100%
  z-index: 50000
  background-color: var(--overlay-secondary-a)
  .material-dialog-content
    position: fixed
    top: 16px
    left: 8px
  .material-card
    @include BoxShadow24()

@include media('>tablet')
  .material-dialog-container
    .material-dialog-content
      position: fixed
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
</style>
