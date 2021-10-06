<template>
  <div class="recentChangesList flexLayout">
    <div
      v-for="site in sitelist"
      :key="site.id"
    >
      <RecentChangesCard
        :site="site"
        :pagelog="changes"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { PageLogEntry, usePagelog } from '@/state/pagelog'
import { useSites } from '@/state/sites'
import { computed, defineComponent, onMounted, ref } from 'vue'
import RecentChangesCard from './RecentChangesCard.vue'

export default defineComponent({
  components: { RecentChangesCard },
  setup () {
    const { publicSites, userSites } = useSites()
    const changes = ref(new Array<PageLogEntry>())
    const { fetchPagelog } = usePagelog()

    onMounted(async () => {
      changes.value = await fetchPagelog()
    })

    const sitelist = computed(() => {
      const sites = new Map(publicSites.value.map((s) => ([s.id, s])))
      userSites.value.forEach((s) => {
        if (!sites.has(s.id)) sites.set(s.id, s)
      })
      return Array.from(sites.values()).sort((a, b) => ((b.lastUpdate?.seconds || 0) - (a.lastUpdate?.seconds || 0)))
    })

    return { sitelist, changes }
  }
})
</script>
