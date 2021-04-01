<template>
  <div class="recentChanges">
    <SiteListToolbar />
    <div class="singleColumnLayout">
      <RecentChangesCard />
    </div>
    <teleport to="#ScreenBottomFloatRight">
      <ToTopFab style="margin-right:8px" />
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SiteListToolbar from '@/components/sites/SiteListToolbar.vue'
import RecentChangesCard from '@/components/sites/RecentChangesCard.vue'
import ToTopFab from '@/components/app/ToTopFab.vue'

export default defineComponent({
  name: 'RecentChanges',
  components: {
    RecentChangesCard,
    SiteListToolbar,
    ToTopFab
  }
})
</script>

<style lang="sass">
</style>
