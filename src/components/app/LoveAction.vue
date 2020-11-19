<template>
  <div
    class="action"
    @click="clicked"
  >
    <transition name="fade">
      <img
        v-if="loved"
        src="@/assets/icons/action-love-full.svg"
        alt="You love this thread, click to unlove"
      >
      <img
        v-else
        src="@/assets/icons/action-love-hollow.svg"
        alt="You dont love this thread yet, click to love"
      >
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoveAction',
  props: {
    loved: {
      type: Boolean,
      required: false,
      default: false
    },
    action: {
      type: Function,
      required: false,
      default: undefined
    }
  },
  setup (props) {
    const clicked = () => {
      if (props.action) props.action()
    }

    return { clicked }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.action
  height: 24px
  width: 24px
  position: relative
  // background-color: $color-primary
  img
    position: absolute
    height: 24px
    width: 24px
    top: 0
    left: 0

</style>
