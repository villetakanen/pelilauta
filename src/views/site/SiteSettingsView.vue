<template>
  <div class="siteSettings">
    <SiteToolbar />
    <div class="dashBoardLayout">
      <SiteAccessDashCard :site="site" />
    </div>
  </div>
</template>

<script lang="ts">
import SiteAccessDashCard from '@/components/site/settings/SiteAccessDashCard.vue'
import SiteToolbar from '@/components/site/header/SiteToolbar.vue'
import { useSite } from '@/state/site'
import { defineComponent } from 'vue'

/**
 * A Router view for a player management screen of a site
 *
 * Loads all the required State entities, and initiates the required Firebase
 * subscriptions.
 * Does not contain any functionality aside from state management and component
 * import/layout
 */
export default defineComponent({
  name: 'SiteSettingsView',
  components: { SiteToolbar, SiteAccessDashCard },
  props: {
    siteid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { site } = useSite(props.siteid)
    return { site }
  }
})
</script>
