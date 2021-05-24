<template>
  <div
    class="loveAThreadAction"
    :class="buttonClasses"
    @click="clicked"
  >
    <span class="loveCount">{{ count }}</span>
    <img
      src="@/assets/icons/love/loveIconBase.svg"
      class="baseImage"
      alt="love"
    >
    <img
      v-if="uid !== authorid && (loves || buttonClasses.submitting)"
      src="@/assets/icons/love/loveIcon.svg"
      :class="{loved: loves}"
      class="loveImage"
      alt="love"
    >
  </div>
</template>

<script lang="ts">
import { useAuthState } from '@/state/authz'
import { defineComponent, PropType, ref } from 'vue'
export default defineComponent({
  props: {
    authorid: {
      type: String,
      required: true
    },
    action: {
      type: Function as PropType<() => Promise<void>>,
      required: false,
      default: undefined
    },
    count: {
      type: Number,
      required: false,
      default: 0
    },
    loves: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup (props) {
    const { uid } = useAuthState()
    const buttonClasses = ref({
      submitting: false,
      fromMe: uid.value === props.authorid
    })

    const clicked = () => {
      if (uid.value === props.authorid) return // no loving of own comments
      buttonClasses.value.submitting = true
      props.action().then(() => {
        buttonClasses.value.submitting = false
      })
    }

    return { uid, buttonClasses, clicked }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
@import @/styles/material-colors.sass
@import @/styles/layout.sass

.loveAThreadAction
  position: relative
  padding: 0 12px
  padding-right: 28px
  cursor: default
  background-color: #{'rgba(var(--chroma-primary-c-rgba), 0.11)'}
  border-radius: 12px
  .baseImage
    opacity: 0.4
  .loveImage
    opacity: 0.8
  .baseImage, .loveImage
    height: 20px
    width: 20px
    padding: 2px
    vertical-align: middle
    position: absolute
    right: 4px
.loveAThreadAction.fromMe
  .baseImage
    opacity: 0.8
.loveAThreadAction.submitting
  .loveImage
    animation-name: pulsing
    animation-duration: 3s

/* The animation code */
@keyframes pulsing
  0%
    transform: scale(0)
  50%
    transform: scale(1)
  100%
    transform: scale(0)
</style>
