<template>
  <MaterialCard>
    <h1>{{ $t('mekanismi.site.identity') }}</h1>
    <img
      v-if="site.splashURL"
      class="cardPoster"
      alt="Site splash image"
      :src="site.splashURL"
    >
    <MaterialSelect
      v-model="selected"
      :label="$t('mekanismi.splashImage')"
      :opts="opts"
    />
    <div style="word-break: break-all; font-size:8pt; opacity: 0.5">
      {{ site }}
    </div>
  </MaterialCard>
</template>
<script lang="ts">
import { computed, ComputedRef, defineComponent, inject } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import { Site, SiteData, updateSite, useFiles } from '@/state/site'
import MaterialSelect from '../material/MaterialSelect.vue'

export default defineComponent({
  name: 'SiteIdentityCard',
  components: { MaterialCard, MaterialSelect },
  setup () {
    const site = inject('site') as ComputedRef<Site>
    const selected = computed({
      get: () => (site.value.splashURL),
      set: (val) => {
        console.log(val)
        const siteFragment:SiteData = { id: site.value.id, splashURL: val }
        updateSite(siteFragment)
      }
    })
    const { files } = useFiles()
    const opts = computed(() => (files.value.map((val) => ({ key: val[1], value: val[0] }))))
    return { site, selected, opts }
  }
})
</script>
