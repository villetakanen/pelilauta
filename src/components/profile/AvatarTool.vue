<template>
  <div class="avatarTool">
    <img :src="profile.photoURL" class="avatarPreview">
    <img
      class="avatarFrame"
      src="@/assets/avatar-border.svg"
    >
    <img
      class="hoverImage"
      src="@/assets/icons/dark/addAnImage.svg"
    >
  </div>
</template>

<script lang="ts">
import { useProfile } from '@/state/authz'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SiteInfo',
  setup () {
    const { profile } = useProfile()
    return { profile }
  }
})
</script>

<style lang="sass" scoped>
.avatarTool
  display: block
  position: relative
  height: 96px
  width: 96px
  .hoverImage
    position: absolute
    top: 24px
    left: 24px
    height: 48px
    width: 48px
    opacity: 0.1
    transition: opacity 0.3s
  .avatarPreview
    position: absolute
    top: 12px
    left: 12px
    height: 72px
    width: 72px
  .avatarFrame
    position: absolute
    top: 12px
    left: 12px
    z-index: 1
    height: 72px
    width: 72px
    opacity: 0.72
.avatarTool:hover
  .hoverImage
    opacity: 0.72
</style>
