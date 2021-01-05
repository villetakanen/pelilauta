<template>
  <div class="material-pill">
    <slot />
    <div
      v-if="action"
      class="icon-container"
      @click="action"
    >
      <Icon :name="actionIcon" />
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
  border: solid 1px black
  height: 18px
  border-radius: 16px
  display: inline-block
  padding: 7px
  margin: 4px
  line-height: 18px
  .icon-container
    vertical-align: middle
    display: inline-block
    height: 18px
    widht: 18px
    border-radius: 9px
    background-color: rgba(0,0,0,0.2)
    margin-left: 8px
</style>
