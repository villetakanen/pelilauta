<template>
  <div class="icon">
    <img
      v-if="name === 'add'"
      src="@/assets/icons/add.svg"
    >
    <img
      v-else
      src="@/assets/icons/d12-black.svg"
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    name: {
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
  .icon
    img
      height: 16px
      width: 16px
      padding: 1px
</style>
