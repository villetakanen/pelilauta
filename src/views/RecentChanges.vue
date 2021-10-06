<template>
  <div class="recentChanges">
    <SiteListToolbar />
    <h1
      class="title"
      style="margin: 0 8px"
    >
      {{ $t('site.recentChanges') }}
    </h1>
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
