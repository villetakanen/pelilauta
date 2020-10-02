<template>
  <NewPostCard />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NewPostCard from '@/components/stream/NewPostCard.vue'

export default defineComponent({
  name: 'StreamPost',
  components: {
    NewPostCard
  },
  setup () {
    console.log('111')
  }
})
</script>
