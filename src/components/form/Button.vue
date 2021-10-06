<template>
  <button
    class="button"
    :class="{
      disabled: disabled,
      secondary: secondary,
      tertiary: tertiary,
      text: text,
      working: working,
      dark: dark
    }"
    @click="emitAction"
  >
    <div class="slot">
      <slot />
    </div>
    <div class="worker">
      <img
        class="light"
        src="@/assets/animations/puff.svg"
        alt=""
      >
      <img
        class="dark"
        src="@/assets/animations/puff-dark.svg"
        alt=""
      >
    </div>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Button',
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    secondary: {
      type: Boolean,
      required: false,
      default: false
    },
    tertiary: {
      type: Boolean,
      required: false,
      default: false
    },
    dark: {
      type: Boolean,
      required: false,
      default: false
    },
    text: {
      type: Boolean,
      required: false,
      default: false
    },
    working: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['action'],
  setup (props, context) {
    function emitAction () {
      if (!props.disabled && !props.working) {
        context.emit('action')
      }
    }
    return { emitAction }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
@import @/styles/box-shadow.sass
button.button
  @include TypeButton()
  @include Rise2()
  background-color: var(--chroma-secondary-d)
  color: var(--chroma-secondary-i)
  border: none
  height: 38px
  margin: 5px
  padding: 0 18px
  border-radius: 19px
  transition-property: box-shadow background
  transition-duration: 0.3s
  position: relative
  &:hover
    background-color: var(--chroma-secondary-e)
  &:active
    background-color: var(--chroma-secondary-c)
    @include Rise1()
  img.dark
    display: none
  div.slot
    display: inline-block
    margin: 0
    transition-property: transform opacity
    transition-duration: 0.3s
  &.dark
    color: white
  // *** disabled *****************************************************
  &.disabled,
  &.disabled:hover,
  &.disabled:active
    @include Rise0()
    background-color: var(--chroma-secondary-i)
    color: var(--chroma-secondary-h)
    border: solid 1px var(--chroma-secondary-g)
    img.dark
      display: inline-block
    img.light
      display: none
  // *** secondary ****************************************************
  &.secondary
    background-color: var(--chroma-primary-d)
    &:hover
      background-color: var(--chroma-primary-e)
    &:active
      background-color: var(--chroma-primary-c)
    &.disabled,
    &.disabled:hover,
    &.disabled:active
      @include Rise0()
      background-color: var(--chroma-secondary-i)
      color: var(--chroma-secondary-h)
      border: solid 1px var(--chroma-secondary-g)
  // *** tertiary *****************************************************
  &.tertiary
    background-color: var(--chroma-primary-h)
    color: var(--chroma-secondary-a)
    &:hover
      background-color: var(--chroma-primary-i)
    &:active
      background-color: var(--chroma-primary-g)
    &.disabled,
    &.disabled:hover,
    &.disabled:active
      @include Rise0()
      background-color: var(--chroma-secondary-i)
      color: var(--chroma-secondary-h)
      border: solid 1px var(--chroma-secondary-g)
  // *** text *********************************************************
  &.text
    @include Rise0()
    background: none
    color: var(--chroma-secondary-d)
    &:hover
      background-color: var(--chroma-secondary-i)
    &:active
      background-color: var(--chroma-secondary-h)
    &.disabled,
    &.disabled:hover,
    &.disabled:active
      @include Rise0()
      background: none
      color: var(--chroma-secondary-g)
      border: none
    img.dark
      display: inline-block
    img.light
      display: none
    &.dark
      color: white
      &:hover
        background: rgba(255, 255, 255, 0.11)
      &:active
        background: rgba(255, 255, 255, 0.22)
  div.worker
    position: absolute
    left: calc(50% - 24px)
    top: -4px
    opacity: 0
    transition-property: opacity
    transition-duration: 0.3s
  &.working
    div.slot
      // transform: translatey(-24px)
      opacity: 0.25
      pointer-events: none
    &.text
      background-color: var(--chroma-secondary-i)
      div.slot
        opacity: 0.5
        transform: none
    div.worker
      opacity: 1
</style>
