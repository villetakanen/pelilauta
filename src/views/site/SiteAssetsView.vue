<template>
  <div class="siteAssetsView viewFull">
    <SiteToolbar />
    <transition name="fade">
      <div
        class="suspense mekanismiGrid"
      >
        <MaterialCard class="mainCard">
          <div v-if="site && site.id">
            <div
              class="toolbar"
              style="margin-bottom: 16px"
            >
              <h1>{{ $t('mekanismi.attachments.title') }}</h1>
              <div class="spacer" />
              <AttachFileButton />
            </div>
            <div class="attachments">
              <AttachmentRow
                v-for="asset, key in assets"
                :key="key"
                :asset="asset[1]"
              />
            </div>
          </div>
          <Loader
            v-else
            poster
          />
        </MaterialCard>
        <MaterialCard class="sideCard">
          <SideBar />
        </MaterialCard>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useSite, useAssets } from '@/state/site'
import MaterialCard from '@/components/material/MaterialCard.vue'
import Loader from '@/components/app/Loader.vue'
import SideBar from '@/components/wikipage/SideBar.vue'
import AttachFileButton from '@/components/sites/AttachFileButton.vue'
import AttachmentRow from '@/components/site/assets/AssetListItem.vue'
import SiteToolbar from '@/components/sites/SiteToolbar.vue'

/**
 * A Router view for a asset management screen of a site
 *
 * Loads all the required State entities, and initiates the required Firebase
 * subscriptions.
 * @TODO Does not contain any functionality aside from state management and component
 * import/layout
 */
export default defineComponent({
  name: 'SiteAssetsView',
  components: {
    MaterialCard,
    Loader,
    SideBar,
    AttachFileButton,
    AttachmentRow,
    SiteToolbar
  },
  props: {
    siteid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { site } = useSite(props.siteid)
    const { assets } = useAssets()
    return { site, assets }
  }
})
</script>
