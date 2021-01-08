<template>
  <div class="icon">
    <img
      v-if="name === 'add' && color !== 'dark'"
      src="@/assets/icons/add.svg"
      alt="add"
    >
    <img
      v-else-if="name === 'add' && color === 'dark'"
      src="@/assets/icons/dark/add.svg"
      alt="add"
    >
    <img
      v-else-if="name === 'edit'"
      src="@/assets/icons/edit.svg"
      alt="edit"
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
    },
    color: {
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

.icon
  display: inline-block
  vertical-align: middle

</style>
