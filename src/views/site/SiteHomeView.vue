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
        <div :innerHTML="page.htmlContent" />
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
import SideBar from '@/components/wikipage/SideBar.vue'
import SiteThreadList from '@/components/site/threads/SiteThreadList.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    Loader,
    SiteToolbar,
    Column,
    SideBar,
    SiteThreadList
  },
  props: {
    siteid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { site } = useSite(props.siteid)
    const { page } = usePage(props.siteid, props.siteid)

    onMounted(() => {
      watch(() => props.siteid, (siteid) => {
        useSite(siteid)
        usePage(props.siteid, props.siteid)
      }, { immediate: true })
    })

    return { page, site }
  }
})
</script>
