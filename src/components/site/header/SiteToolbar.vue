<template>
  <Header
    id="siteToolbar"
  >
    <ViewTitle
      :icon="site.system + '-logo'"
    >
      <router-link :to="`/site/${site.id}`">
        {{ site.name }}
      </router-link>
    </ViewTitle>

    <SpacerDiv />

    <ShareButton />
    <SiteHeaderMenu />
  </Header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Header from '../../layout/Header.vue'
import SpacerDiv from '../../layout/SpacerDiv.vue'
import ViewTitle from '../../layout/ViewTitle.vue'
import ShareButton from '../../actions/ShareButton.vue'
import { useSite } from '@/state/site'
import SiteHeaderMenu from './SiteHeaderMenu.vue'

export default defineComponent({
  components: { Header, SpacerDiv, ViewTitle, ShareButton, SiteHeaderMenu },
  setup () {
    const { site } = useSite()
    return { site }
  }
})
</script>
