<template>
  <div
    class="material-pill"
    :class="{ secondary: color === 'secondary' }"
  >
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

  &.secondary
    background-color: rgba($color-fill-secondary, 0.37)
    .icon-container
      background-color: $color-fill-secondary
</style>
