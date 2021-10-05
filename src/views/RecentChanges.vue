<template>
  <div class="recentChanges">
    <SiteListToolbar />
    <RecentChangesList />
    <teleport to="#ScreenBottomFloatRight">
      <ToTopFab style="margin-right:8px" />
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SiteListToolbar from '@/components/sites/SiteListToolbar.vue'
import RecentChangesList from '@/components/sites/RecentChangesList.vue'
import ToTopFab from '@/components/app/ToTopFab.vue'

export default defineComponent({
  name: 'RecentChanges',
  components: {
    RecentChangesList,
    SiteListToolbar,
    ToTopFab
  }
})
</script>

<style lang="sass">
</style>
