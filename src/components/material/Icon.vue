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
      v-else-if="name === 'mekanismi' && color === 'dark'"
      src="@/assets/icons/dark/mekanismi-icon.svg"
      alt="add"
    >
    <img
      v-else-if="name === 'site' && color === 'dark'"
      src="@/assets/icons/dark/site.svg"
      alt="add"
    >
    <img
      v-else-if="name === 'avatar' && color === 'dark'"
      src="@/assets/icons/dark/avatar.svg"
      alt="d6"
    >
    <img
      v-else-if="name === 'd6' && color === 'dark'"
      src="@/assets/icons/dark/d6.svg"
      alt="d6"
    >
    <img
      v-else-if="name === 'd6'"
      src="@/assets/icons/d6.svg"
      alt="d6"
    >
    <img
      v-else-if="name === 'remove'"
      src="@/assets/icons/add.svg"
      style="transform: rotate(42deg)"
      alt="remove"
    >
    <img
      v-else-if="name === 'close' && color === 'dark'"
      src="@/assets/icons/dark/close.svg"
      alt="add"
    >
    <img
      v-else-if="name === 'edit'"
      src="@/assets/icons/edit.svg"
      alt="edit"
    >
    <img
      v-else-if="color === 'dark'"
      src="@/assets/icons/dark/d12.svg"
      alt="d12"
    >
    <img
      v-else
      src="@/assets/icons/d12-black.svg"
      alt="d12"
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

.material-action
  .icon
    margin-right: 8px
    img
      height: 32px
      width: 32px

.material-pill
  .icon-container
    .icon
      img
        height: 28px
        width: 28px
        padding: 2px
        vertical-align: middle

</style>
