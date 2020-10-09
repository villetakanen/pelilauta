<template>
  <teleport to="body">
    <div
      v-show="modelValue"
      class="material-dialog-container"
      @click="close"
    >
      <transition name="bounce">
        <div
          v-if="modelValue"
          class="material-dialog-content"
        >
          <slot />
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

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
  background-color: rgba(40,70,100,0.5)
  .material-dialog-content
    position: fixed
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    max-width: 500px
  .material-card
    @include BoxShadow24()

</style>
