<template>
  <div class="loveAReplyAction">
    <span class="loveCount">{{ count }}</span>
    <img
      src="@/assets/icons/love/loveIconBase.svg"
      class="baseImage"
    >
    <img
      src="@/assets/icons/love/loveIcon.svg"
      :class="{loved: loved}"
      class="loveImage"
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  props: {
    authorid: {
      type: String,
      required: true
    },
    replyid: {
      type: String,
      required: true
    }
  },
  setup () {
    const count = ref(0)
    return { count }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
@import @/styles/material-colors.sass
@import @/styles/layout.sass

.loveAReplyAction
  position: relative
  padding-right: 24px
  .baseImage
    opacity: 0.4
  .baseImage, .loveImage
    height: 20px
    width: 20px
    padding: 2px
    vertical-align: middle
    position: absolute
    right: 0

</style>
