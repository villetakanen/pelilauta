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
