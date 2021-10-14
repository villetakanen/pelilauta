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
        <section :innerHTML="renderWikiLinks(site.id, page.htmlContent)" />
      </Column>
      <SideBar />
      <Column>
        <SiteThreadList
          v-if="site.name"
          :siteid="site.id"
        />
      </Column>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue'
import { useSite } from '@/state/site'
import Loader from '@/components/app/Loader.vue'
import SiteToolbar from '@/components/sites/SiteToolbar.vue'
import { usePage } from '@/state/pages/usePage'
import Column from '@/components/layout/Column.vue'
import SideBar from '@/components/site/SideBar.vue'
import SiteThreadList from '@/components/site/threads/SiteThreadList.vue'
import { useThreads } from '@/state/threads'
import { renderWikiLinks } from '@/utils/contentFormat'
import Button from '@/components/form/Button.vue'
import { useUxActions } from '@/composables/useUxActions'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    Loader,
    SiteToolbar,
    Column,
    SideBar,
    SiteThreadList,
    Button
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
    const { fetchSiteThreads } = useThreads()
    const { reroute } = useUxActions()

    onMounted(() => {
      watch(() => props.siteid, (siteid) => {
        useSite(siteid)
        usePage(props.siteid, props.siteid)
        fetchSiteThreads(props.siteid)
      }, { immediate: true })
    })

    return { page, site, renderWikiLinks, showSiteMemberTools, reroute }
  }
})
</script>
