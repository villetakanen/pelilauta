<template>
  <div>
  <MaterialCard v-for="(topic, index) in topics" v-bind:key="index">
    <h1>
      <router-link :to="`/stream/topic/${topic.slug}`">{{ topic.title }}</router-link>
    </h1>
  </MaterialCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'

export default defineComponent({
  name: 'Home',
  components: {
    MaterialCard
  },
  setup () {
    const topics = ref([
      {
        slug: 'roolipelit',
        title: 'Roolipelit'
      },
      {
        slug: 'pelisuunnittelu',
        title: 'Pelisuunnittelu'
      },
      {
        slug: 'yleinen',
        title: 'Yleinen'
      }
    ])
    return { topics }
  }
})
</script>
