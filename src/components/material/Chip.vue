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
    }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
.chip
  @include TypeCaption()
  background-color: var(--chroma-primary-h)
  height: 22px
  margin: 1px
  line-height: 16px
  display: inline-block
  box-sizing: border-box
  padding: 2px 11px
  border-radius: 11px
  position: relative
  .chipIcon
    display: inline-block
    margin: 0
    padding: 0
    background-color: var(--chroma-secondary-h)
    border-radius: 11px
    margin-top: -2px
    margin-left: -11px
    margin-right: 4px
  &.secondaryColors
    background-color: var(--chroma-secondary-i)
    .chipIcon
      background-color: var(--chroma-secondary-h)
</style>
