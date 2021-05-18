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
        :class="{ sending: sending }"
      >
      <img
        v-else
        src="@/assets/icons/action-love-hollow.svg"
        alt="You dont love this thread yet, click to love"
        :class="{ sending: sending }"
      >
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'

export default defineComponent({
  name: 'LoveAction',
  props: {
    loved: {
      type: Boolean,
      required: false,
      default: false
    },
    action: {
      type: Function as PropType<() => Promise<void>>,
      required: false,
      default: undefined
    }
  },
  setup (props) {
    const sending = ref(false)
    const clicked = () => {
      sending.value = true
      if (props.action) {
        props.action().then(() => {
          sending.value = false
        })
      }
    }

    return { clicked, sending }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

.action
  height: 24px
  width: 24px
  position: relative
  img
    position: absolute
    height: 24px
    width: 24px
    top: 0
    left: 0

.sending
  animation-name: roll
  animation-duration: 1s
  animation-iteration-count: infinite

@keyframes roll
  0%
    transform: rotate(0deg)
    opacity: 1
  50%
    transform: rotate(180deg)
    opacity: 0
  100%
    transform: rotate(360deg)
    opacity: 1

</style>
