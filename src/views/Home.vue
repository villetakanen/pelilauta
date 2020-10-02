<template>
  <MaterialCard>
    <div style="text-align:center;margin-top:8px"><a href="https://mekanismi.sange.fi">Mekanismi</a> / Pelilauta</div>
    <img class="fox-logo" alt="Pelilauta" src="../assets/fox.svg">
    <div class="toolbar">
      <router-link to="/stream/topic/roolipelit">Roolipelit</router-link>
      <router-link to="/stream/topic/pelisuunnittelu">Pelisuunnittelu</router-link>
      <router-link to="/stream/topic/yleinen">Yleinen</router-link>
    </div>
  </MaterialCard>
  <NewPostCard />
  <Stream />
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
  margin: 8px auto
  display: block
  max-width: 96px
</style>
