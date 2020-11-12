<template>
  <MaterialCard>
    <ThreadCardHeader :thread="thread" />
    <div :innerHTML="thread.data.content" class="cardContent"/>
    <ThreadCardTailer :thread="thread" />
  </MaterialCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Thread } from '@/state/threads'
import MaterialCard from '@/components/material/MaterialCard.vue'
import ThreadCardHeader from './ThreadCardHeader.vue'
import ThreadCardTailer from './ThreadCardTailer.vue'

export default defineComponent({
  name: 'ThreadCard',
  components: {
    MaterialCard,
    ThreadCardHeader,
    ThreadCardTailer
  },
  props: {
    thread: {
      type: Object as () => Thread,
      required: true
    }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.cardContent
  color: $color-font-medium
</style>
