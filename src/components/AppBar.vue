<template>
  <div
    id="AppBar"
  >
    <div
      id="AppBarToolbar"
      class="toolbar"
    >
      <h1 class="font-button">
        Pelilauta 2
      </h1>
      <div style="vertical-align:top; height 30px">
        <p  style="line-height: 14px; font-size: 14px; color: #adc">α</p>
      </div>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
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
