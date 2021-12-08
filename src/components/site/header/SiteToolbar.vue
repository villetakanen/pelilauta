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

    <Button
      v-if="site.usePlayers"
      class="hideOnMobile"
      text
      @click="reroute('/site/' + site.id + '/keeper')"
    >
      <Icon
        name="keeper"
        small
      />
      <span class="onlyForDesktop">{{ $t('keeper.title') }}</span>
    </Button>

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
import Button from '@/components/form/Button.vue'
import Icon from '@/components/material/Icon.vue'
import { useUxActions } from '@/composables/useUxActions'

export default defineComponent({
  components: { Header, SpacerDiv, ViewTitle, ShareButton, SiteHeaderMenu, Button, Icon },
  setup () {
    const { site } = useSite()
    const { reroute } = useUxActions()
    return { site, reroute }
  }
})
</script>
