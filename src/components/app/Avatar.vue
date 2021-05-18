<template>
  <div class="avatar">
    <transition name="fade">
      <img
        v-if="photo"
        :src="photo"
        :alt="nick"
      >
      <img
        v-else
        src="@/assets/avatar.svg"
        style="opacity:0.5"
        alt="Avatar Image not Set"
      >
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Avatar',
  props: {
    nick: {
      type: String,
      required: false,
      default: 'a fox'
    },
    photo: {
      type: String,
      required: false,
      default: ''
    }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

div.avatar
  background-color: var(--chroma-primary-a)
  margin: 0
  padding: 2px
  height: 44px
  width: 44px
  flex-shrink: 0
  overflow: hidden
  border-radius: 24px
  img
    max-height: 44px
    max-width: 44px
    border-radius: 22px
</style>
