<template>
  <MaterialCard>
    <img class="fox-logo" alt="Pelilauta" src="../assets/fox.svg">
    <MaterialButton>Just a button?</MaterialButton>
  </MaterialCard>
  <div class="two-columns">
    <MaterialCard>
      <h3>Stream</h3>
      <Stream />
    </MaterialCard>
    <MaterialCard>
      <h3>Topics</h3>
    </MaterialCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import Stream from '@/components/stream/Stream.vue'

export default defineComponent({
  name: 'Home',
  components: {
    MaterialButton,
    MaterialCard,
    Stream
  }
})
</script>

<style lang="sass" scoped>
.fox-logo
  margin: 0 auto
  display: block
  max-width: 220px
.two-columns
  display: flex
  flex-direction: row
  .material-card
    width: 374px
</style>
