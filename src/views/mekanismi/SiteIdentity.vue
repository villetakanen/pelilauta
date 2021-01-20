<template>
  <MaterialCard>
    <h1>{{ $t('mekanismi.site.identity') }}</h1>
    {{ site }}
  </MaterialCard>
</template>
<script lang="ts">
import { ComputedRef, defineComponent, inject } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import { Site } from '@/state/site'

export default defineComponent({
  name: 'SiteIdentityCard',
  components: { MaterialCard },
  setup () {
    const site = inject('site') as ComputedRef<Site>
    return { site }
  }
})
</script>
