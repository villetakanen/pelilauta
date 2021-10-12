<template>
  <div class="siteAssetsView">
    <Header>
      <ViewTitle
        :parent="site.name"
        :parent-route="`/site/${site.id}`"
        :icon="site.systemBadge + '-logo'"
      >
        {{ $t('mekanismi.attachments.title') }}
      </ViewTitle>
      <SpacerDiv />
      <AddAssetFab v-if="crudActions" />
    </Header>
    <main
      v-if="site"
      class="flexLayout"
      style="margin-top:12px"
    >
      <AttachmentRow
        v-for="asset, key in assets"
        :key="key"
        :asset="asset[1]"
      />
    </main>
    <Loader
      v-else
      poster
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useSite, useAssets } from '@/state/site'
import Loader from '@/components/app/Loader.vue'
import AttachmentRow from '@/components/site/assets/AssetListItem.vue'
import { useAuth } from '@/state/authz'
import AddAssetFab from '@/components/site/assets/AddAssetFab.vue'
import ViewTitle from '@/components/layout/ViewTitle.vue'
import Header from '@/components/layout/Header.vue'
import SpacerDiv from '@/components/layout/SpacerDiv.vue'

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
    AttachmentRow,
    AddAssetFab,
    ViewTitle,
    Header,
    SpacerDiv
  },
  props: {
    siteid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { site, hasAdmin } = useSite(props.siteid)
    const { user } = useAuth()
    const { assets } = useAssets()

    const crudActions = computed(() => {
      return hasAdmin(user.value.uid)
    })

    return { site, assets, crudActions }
  }
})
</script>
