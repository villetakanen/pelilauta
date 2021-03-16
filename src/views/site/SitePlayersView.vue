<template>
  <div class="sitePlayersView viewFull">
    <SiteToolbar />
    <SitePlayersList :site="site" />
  </div>
</template>

<script lang="ts">
import SitePlayersList from '@/components/sites/SitePlayersList.vue'
import SiteToolbar from '@/components/sites/SiteToolbar.vue'
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
  name: 'SitePlayersView',
  components: { SiteToolbar, SitePlayersList },
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
