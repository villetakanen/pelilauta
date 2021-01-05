<template>
  <div class="material-pill">
    <slot />
    <div
      v-if="action"
      class="icon"
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
  border: solid 1px black
  height: 20px
  border-radius: 10px
  display: inline-block
  box-sizing: border-box
  padding: 4px
  margin: 2px
  .icon
    display: inline
    height: 18px
    widht: 18px
    background-color: rgba(0,0,0,0.2)
</style>
