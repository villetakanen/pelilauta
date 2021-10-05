<template>
  <div class="recentChangesList">
    <div
      v-for="site in sitelist"
      :key="site.id"
    >
      {{ site.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { useSites } from '@/state/sites'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  components: { },
  setup () {
    const { publicSites, userSites } = useSites()

    const sitelist = computed(() => {
      const sites = new Map(publicSites.value.map((s) => ([s.id, s])))
      userSites.value.forEach((s) => {
        if (!sites.has(s.id)) sites.set(s.id, s)
      })
      return Array.from(sites.values()).sort((a, b) => ((b.lastUpdate?.seconds || 0) - (a.lastUpdate?.seconds || 0)))
    })

    return { sitelist }
  }
})
</script>
