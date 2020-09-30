<template>
  <div
    id="AppBar"
  >
    <div
      id="AppBarToolbar"
      class="toolbar"
    >
      <h1 class="font-button">
        Pelilauta
      </h1>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <div class="spacer" />
      <ProfileAction />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProfileAction from './ProfileAction.vue'

export default defineComponent({
  components: {
    ProfileAction
  }
})
</script>
