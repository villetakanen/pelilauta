<template>
  <div class="toolbar">
    <h1>{{ title}}</h1>
    <div class="spacer" />
    <MaterialButton
      icon
      color="tertiary"
    >
      <img src="@/assets/icons/share.svg">
    </MaterialButton>
    <MaterialButton
      icon
    >
      <img src="@/assets/icons/edit.svg">
    </MaterialButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'

export default defineComponent({
  name: 'PageToolbar',
  components: {
    MaterialButton
  },
  props: {
    title: {
      type: String,
      required: false,
      default: 'Mekanismi'
    }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
@import @/styles/layout.sass
@import @/styles/include-media.scss

.toolbar
  margin-bottom: -40px
  h1
    @include TypeButton()
</style>
