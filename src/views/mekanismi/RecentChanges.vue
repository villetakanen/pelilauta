<template>
  <div class="contentGrid">
    <SiteListToolbar />
    <RecentChangesCard />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SiteListToolbar from '@/components/sites/SiteListToolbar.vue'
import RecentChangesCard from '@/components/sites/RecentChangesCard.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    RecentChangesCard,
    SiteListToolbar
  }
})
</script>

<style lang="sass">
</style>
