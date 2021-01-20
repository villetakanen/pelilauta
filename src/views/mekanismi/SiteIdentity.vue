<template>
  <MaterialCard>
    <h1>{{ $t('mekanismi.site.identity') }}</h1>
  </MaterialCard>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'

export default defineComponent({
  name: 'SiteIdentityCard',
  components: { MaterialCard }
})
</script>
