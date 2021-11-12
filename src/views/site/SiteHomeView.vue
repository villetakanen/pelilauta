<template>
  <div class="siteHomeView">
    <SiteToolbar />
    <Loader
      v-if="!site || !site.id"
      poster
    />
    <div
      v-else
      class="bookLayout"
    >
      <Column class="double">
        <Button
          v-if="showSiteMemberTools"
          style="float: right"
          @click="reroute('/site/' + site.id + '/page/' +page.id + '/edit')"
        >
          {{ $t('action.edit') }}
        </Button>
        <section
          class="richText"
          :innerHTML="renderWikiLinks(site.id, page.htmlContent)"
        />
      </Column>
      <SideBar />
      <Column>
        <SiteThreadList
          v-if="site.name"
          :siteid="site.id"
        />
      </Column>
    </div>
    <teleport to="#ScreenBottomFabsContainer">
      <FabTray v-if="showTools">
        <Fab3
          :icon="'addDiscussion'"
          :label="$t('action.addThread')"
          @click="reroute('/site/' + site.id + '/add/thread')"
        />
        <Fab3
          :icon="'addPage'"
          small
          :label="$t('action.addPage')"
          @click="reroute('/site/' + site.id + '/add/page')"
        />
        <Fab3
          :icon="'edit'"
          secondary
          small
          :label="$t('action.edit')"
          @click="reroute('/site/' + site.id + '/page/' +page.id + '/edit')"
        />
      </FabTray>
    </teleport>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch } from 'vue'
import { SiteClass, useSite } from '@/state/site'
import Loader from '@/components/app/Loader.vue'
import SiteToolbar from '@/components/site/header/SiteToolbar.vue'
import { usePage } from '@/state/pages/usePage'
import Column from '@/components/layout/Column.vue'
import SideBar from '@/components/site/SideBar.vue'
import SiteThreadList from '@/components/site/threads/SiteThreadList.vue'
import { useThreads } from '@/state/threads'
import { renderWikiLinks } from '@/utils/contentFormat'
import Button from '@/components/form/Button.vue'
import { useUxActions } from '@/composables/useUxActions'
import FabTray from '@/components/material3/FabTray.vue'
import Fab3 from '@/components/material3/Fab3.vue'
import { useAuth } from '@/state/authz'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    Loader,
    SiteToolbar,
    Column,
    SideBar,
    SiteThreadList,
    Button,
    FabTray,
    Fab3
  },
  props: {
    siteid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { site, showSiteMemberTools } = useSite(props.siteid)
    const { page } = usePage(props.siteid, props.siteid)
    const { user } = useAuth()
    const { fetchSiteThreads } = useThreads()
    const { reroute } = useUxActions()

    onMounted(() => {
      watch(() => props.siteid, (siteid) => {
        useSite(siteid)
        usePage(props.siteid, props.siteid)
        fetchSiteThreads(props.siteid)
      }, { immediate: true })
    })

    const showTools = computed(() => {
      return new SiteClass(site.value).isOwner(user.value.uid)
    })

    return { page, site, renderWikiLinks, showSiteMemberTools, reroute, showTools }
  }
})
</script>
