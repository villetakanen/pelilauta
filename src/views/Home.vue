<template>
  <MaterialCard>
    <img class="fox-logo" alt="Pelilauta" src="../assets/fox.svg">
    <div style="text-align:center;margin-top:8px"><a href="https://mekanismi.sange.fi">Mekanismi</a> / Pelilauta</div>
  </MaterialCard>
  <NewPostCard />
  <!--div class="two-columns"-->
    <MaterialCard>
      <h3>Stream</h3>
      <Stream />
    </MaterialCard>
    <!--MaterialCard>
      <h3>Topics</h3>
    </MaterialCard>
  </div-->
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import Stream from '@/components/stream/Stream.vue'
import NewPostCard from '@/components/stream/NewPostCard.vue'

export default defineComponent({
  name: 'Home',
  components: {
    MaterialCard,
    Stream,
    NewPostCard
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
