<template>
  <div class="siteSettings">
    <SiteToolbar />
    <div class="dashBoardLayout">
      <SiteMetaData />
      <SiteOwnersTool :site="site" />
      <SitePlayesTool />
    </div>
  </div>
</template>

<script lang="ts">
import SiteToolbar from '@/components/site/header/SiteToolbar.vue'
import { useSite } from '@/state/site'
import { defineComponent } from 'vue'
import SiteOwnersTool from '@/components/site/settings/SiteOwnersTool.vue'
import SitePlayesTool from '@/components/keeper/SitePlayesTool.vue'
import SiteMetaData from '@/components/site/settings/SiteMetaData.vue'

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
  components: { SiteToolbar, SiteOwnersTool, SitePlayesTool, SiteMetaData },
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
