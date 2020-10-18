<template>
  <div
    class="action"
    @click="clicked"
  >
    <transition name="fade">
      <img
        v-if="toggle"
        src="@/assets/icons/action-love-full.svg"
      >
      <img
        v-else
        src="@/assets/icons/action-love-hollow.svg"
      >
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

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
    const toggle = ref(props.loved)

    const clicked = () => {
      toggle.value = !toggle.value
      if (props.action) props.action()
    }

    return { toggle, clicked }
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
