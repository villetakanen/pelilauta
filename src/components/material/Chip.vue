<template>
  <div
    class="chip"
    :class="{secondaryColors: secondary}"
  >
    <Icon
      v-if="icon"
      :name="icon"
      class="chipIcon"
    />
    <span class="label">{{ label }}</span>
    <Icon
      v-if="deleteFunction"
      name="delete"
      class="chipIcon post"
      @click="deleteFunction"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Icon from './Icon.vue'

export default defineComponent({
  components: { Icon },
  props: {
    icon: {
      type: String,
      required: false,
      default: ''
    },
    secondary: {
      type: Boolean,
      required: false,
      default: false
    },
    label: {
      type: String,
      required: true
    },
    deleteFunction: {
      type: Object.getPrototypeOf(async function () {}).constructor,
      required: false,
      default: undefined
    }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
.chip
  @include TypeBody2()
  background-color: var(--chroma-primary-i)
  color: var(--chroma-primary-b)
  height: 32px
  margin: 8px 0px
  line-height: 28px
  display: inline-block
  box-sizing: border-box
  padding: 2px 11px
  border-radius: 16px
  position: relative
  .chipIcon
    display: inline-block
    margin: 0
    padding: 0
    background-color: var(--chroma-primary-h)
    border-radius: 16px
    margin-top: -2px
    margin-left: -9px
    margin-right: 4px
  .chipIcon.post
    margin-left: 2px
    margin-right: -9px
  &.secondaryColors
    background-color: var(--chroma-secondary-h)
    color: var(--chroma-secondary-c)
    .chipIcon
      background-color: var(--chroma-secondary-i)
.chip+.chip
  margin-left: 8px
</style>
