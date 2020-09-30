<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <MaterialButton>Just a button?</MaterialButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue' // @ is an alias to /src

export default defineComponent({
  name: 'Home',
  components: {
    MaterialButton
  }
})
</script>
