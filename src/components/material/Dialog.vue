<template>
  <teleport to="body">
    <div
      v-show="modelValue"
      id="dialog"
      @click.self="close"
    >
      <div
        v-if="modelValue"
        class="dialogCard"
      >
        <div class="dialogToolBar">
          <Icon
            name="back"
            headline
            dark
            @click="close"
          />
          <h1 class="label">
            {{ label }}
          </h1>
        </div>
        <div class="contentSlot">
          <slot />
        </div>
        <slot name="footer" />
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
import Icon from './Icon.vue'

export default defineComponent({
  name: 'Dialog',
  components: { Icon },
  props: {
    modelValue: {
      type: Boolean,
      required: false,
      default: false
    },
    label: {
      type: String,
      required: false,
      default: ''
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
@import @/styles/material-typography.sass
@import @/styles/include-media.scss
@import @/styles/box-shadow.sass

div#dialog
  position: fixed
  top:0
  left:0
  width: 100%
  height: 100%
  z-index: 50000
  background-color: var(--overlay-secondary-a)
  .dialogToolBar
    display: flex
    background-color: var(--chroma-secondary-d)
    padding: 4px
    border-radius: 12px 12px 0 0
    margin: -16px
    margin-bottom: 16px
    h1.label
      @include TypeHeadline5()
      color: white
      padding: 0 16px
  .dialogCard
    position: absolute
    top: 8px
    left: 8px
    background-color: var(--chroma-clear)
    @include Rise3()
    border-radius: 12px
    width: calc(100% - 16px)
    height: auto // xcalc(100% - 16px)
    box-sizing: border-box
    padding: 16px
  .contentSlot
    overflow: scroll

@include media('>=tablet')
  div#dialog
    .dialogCard
      position: fixed
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      width: auto
      height: auto
      border-radius: 4px
      max-width: 720px
      // padding: 0
    .dialogToolBar
      border-radius: 4px 4px 0 0
</style>
