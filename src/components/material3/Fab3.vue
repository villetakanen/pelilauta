<template>
  <button
    class="Fab"
    :class="{
      small: small
    }"
  >
    <Icon :name="icon" />
    <span
      v-if="label"
      class="label onlyForDesktop"
    >{{ label }}</span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Icon from '../material/Icon.vue'
export default defineComponent({
  name: 'Fab3',
  components: { Icon },
  props: {
    icon: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: false,
      default: ''
    },
    small: {
      type: Boolean,
      required: false,
      default: false
    }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
@import @/styles/box-shadow.sass

button.Fab
  @include TypeButton()
  @include Rise2()
  border: 0
  height: 56px
  background-color: var(--chroma-primary-h)
  box-sizing: border-box
  padding: 16px
  border-radius: 16px
  transition: all 0.3s
  .label
    padding: 0 6px
  &.small
    height: 40px
    padding: 8px
    border-radius: 12px
  &:hover
    background-color: var(--chroma-primary-g)
  &:active
    background-color: var(--chroma-primary-i)
    @include Rise1()

button.Fab + button.Fab
  margin-left: 12px
</style>
