<template>
  <div
    id="AppBar"
  >
    <div
      id="AppBarToolbar"
      class="toolbar"
    >
      <MaterialAction
        to="/"
        />
      <h1 class="font-button">
        Pelilauta 2
      </h1>
      <MaterialAction
        to="/about"
        icon="about"
        />
      <div class="spacer" />
      <MaterialAction
        text="Topics"
        icon="topic"
        to="/stream/index"
        />
      <ProfileAction />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProfileAction from './ProfileAction.vue'
import MaterialAction from '@/components/material/MaterialAction.vue'
export default defineComponent({
  components: {
    ProfileAction,
    MaterialAction
  }
})
</script>
