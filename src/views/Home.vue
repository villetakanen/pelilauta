<template>
  <MaterialFab
    text="New post">
    <img src="@/assets/add.svg" alt="new comment" />
  </MaterialFab>
  <NewPostCard />
  <Stream />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Stream from '@/components/stream/Stream.vue'
import NewPostCard from '@/components/stream/NewPostCard.vue'
import MaterialFab from '@/components/material/MaterialFab.vue'

export default defineComponent({
  name: 'Home',
  components: {
    Stream,
    NewPostCard,
    MaterialFab
  }
})
</script>
