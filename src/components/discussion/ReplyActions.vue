<template>
  <div class="replyActions">
    <img
      v-if="!open"
      src="@/assets/icons/vertical-menu-closed.svg"
      style="height:20px; margin: 2px"
      @click="open=!open"
    >
    <div v-if="open">
      <img
        src="@/assets/icons/vertical-menu-open.svg"
        style="height:20px; margin: 2px"
        @click="open=!open"
      >
      <img
        src="@/assets/icons/share-reply.svg"
        style="height:20px; margin: 2px"
        @click="open=!open"
      >
      <img
        src="@/assets/icons/quote.svg"
        style="height:20px; margin: 2px"
        @click="open=!open"
      >
      <img
        src="@/assets/icons/delete.svg"
        style="height:20px; margin: 2px"
        @click="open=!open"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ReplyActions',
  setup () {
    const open = ref(false)
    return { open }
  }
})
</script>
