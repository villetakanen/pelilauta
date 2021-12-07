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
      const sites = [...publicSites.value, ...userSites.value]
      return sites.sort((a, b) => {
        b.compareChangeTime(a)
        return 0
      })
    })

    return { sitelist, changes }
  }
})
</script>
