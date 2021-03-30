<template>
  <div
    class="material-pill"
    :class="{ secondary: color === 'secondary', small: small, dark: dark }"
  >
    <div
      v-if="prependIcon"
      class="icon-container prepend"
    >
      <Icon
        :name="prependIcon"
        :color="dark ? '' : 'dark'"
        x-small
      />
    </div>
    <slot />
    <div
      v-if="action || actionIcon"
      class="icon-container"
      @click="action"
    >
      <Icon
        v-if="actionIcon"
        :name="actionIcon"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Icon from './Icon.vue'

export default defineComponent({
  components: { Icon },
  props: {
    actionIcon: {
      type: String,
      required: false,
      default: ''
    },
    action: {
      type: Function,
      required: false,
      default: undefined
    },
    color: {
      type: String,
      required: false,
      default: ''
    },
    prependIcon: {
      type: String,
      required: false,
      default: ''
    },
    small: {
      type: Boolean,
      required: false,
      default: false
    },
    dark: {
      type: Boolean,
      required: false,
      default: false
    }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.material-pill
  @include TypeCaption()
  background-color: rgba($color-fill-primary, 0.37)
  height: 18px
  border-radius: 16px
  display: inline-block
  padding: 7px 12px
  margin: 4px
  line-height: 18px
  vertical-align: middle
  &.dark
    background: linear-gradient(140deg, var(--chroma-primary-i) 0%, var(--chroma-primary-h) 100%) // linear-gradient(127deg, rgba(0,121,107,1) 0%, rgba(0,200,83,1) 100%)
    //box-shadow: 1px 1px 7px 0.5 var(--chroma-secondary-f)
  &.small
    padding: 2px 10px
    height: 20px
    margin: 0
    .icon-container
      height: 24px
      width: 24px
      margin-top: -2px
      margin-right: 4px
      background: none
  .icon-container
    vertical-align: middle
    display: inline-block
    height: 32px
    width: 32px
    border-radius: 16px
    background-color: $color-fill-primary
    margin-left: 4px
    margin-right: -12px
    margin-top: -7px
    overflow: hidden
    &.prepend
      margin-left: -8px

  &.secondary
    background-color: rgba($color-fill-secondary, 0.37)
    .icon-container
      background-color: $color-fill-secondary
</style>
