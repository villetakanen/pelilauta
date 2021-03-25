<template>
  <div class="siteAssetsView">
    <div style="margin: 0 8px">
      <SiteToolbar />
    </div>
    <div class="mekanismiGrid">
      <div class="mainCard">
        <div v-if="site && site.id">
          <h3>{{ $t('mekanismi.attachments.title') }}</h3>
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
      </div>
      <Card
        class="sideCard"
        :rise="4"
      >
        <SideBar />
      </Card>
    </div>
    <teleport to="#ScreenBottomFloatRight">
      <Fab
        v-if="crudActions"
        id="addAssetFab"
        :to="'/site/add/asset/' + siteid"
        :text="$t('action.add')"
        color="tertiary"
      >
        <Icon
          dark
          name="addAnImage"
        />
      </Fab>
    </teleport>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useSite, useAssets } from '@/state/site'
import Loader from '@/components/app/Loader.vue'
import SideBar from '@/components/wikipage/SideBar.vue'
import AttachmentRow from '@/components/site/assets/AssetListItem.vue'
import SiteToolbar from '@/components/sites/SiteToolbar.vue'
import Card from '@/components/layout/Card.vue'
import Fab from '@/components/material/Fab.vue'
import { useAuthState } from '@/state/authz'
import Icon from '@/components/material/Icon.vue'

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
    Loader,
    SideBar,
    AttachmentRow,
    SiteToolbar,
    Card,
    Fab,
    Icon
  },
  props: {
    siteid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { site, hasAdmin } = useSite(props.siteid)
    const { uid } = useAuthState()
    const { assets } = useAssets()

    const crudActions = computed(() => {
      return hasAdmin(uid.value)
    })

    return { site, assets, crudActions }
  }
})
</script>
