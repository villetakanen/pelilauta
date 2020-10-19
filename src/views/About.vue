<template>
  <MaterialCard class="about">
    <h1>{{ $t('about.title') }}</h1>
    <p>{{ $t('about.text') }}</p>
  </MaterialCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'

export default defineComponent({
  name: 'About',
  components: {
    MaterialCard
  }
})
</script>
