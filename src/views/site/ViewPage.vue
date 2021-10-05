<template>
  <div class="viewPage">
    <PageToolbar :title="page.name" />
    <div class="bookLayout">
      <Column class="double">
        <transition name="fade">
          <div v-if="site.name && page.name">
            <div
              class="contentBox wikiPageContainer richText"
              :innerHTML="renderWikiLinks(site.id, page.htmlContent)"
            />
          </div>
          <Loader
            v-else
            poster
            style="margin-bottom: -80px"
          />
        </transition>
      </Column>
      <SideBar v-if="site.name" />
      <PageFabs />
    </div>
  </div>
</template>

<script lang="ts">
import { ComputedRef, defineComponent, inject, onMounted, provide, watch } from 'vue'
import SideBar from '@/components/site/SideBar.vue'
import { fetchPage, usePages, useSite } from '@/state/site'
import Loader from '@/components/app/Loader.vue'
import PageFabs from '@/components/wikipage/PageFabs.vue'
import { renderWikiLinks } from '@/utils/contentFormat'
import PageToolbar from '@/components/page/PageToolbar.vue'
import Column from '@/components/layout/Column.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    Loader,
    SideBar,
    PageFabs,
    PageToolbar,
    Column
  },
  props: {
    siteid: {
      type: String,
      required: true
    },
    pageid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { site } = useSite(props.siteid)
    const { page, pages } = usePages()

    onMounted(() => {
      watch(() => props.pageid, (pageid) => {
        fetchPage(pageid)
      }, { immediate: true })
    })

    // const route = useRoute()
    const mobileViewport = inject('mobileViewport') as ComputedRef<boolean>

    provide('site', site)
    provide('page', page)
    provide('pages', pages)

    return { page, site, mobileViewport, renderWikiLinks }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass
@import @/styles/box-shadow.sass

.mainCard
  min-height: 152px
  margin: 0 16px
  margin-bottom: 24px
.wikiPageContainer
  margin: 0
  padding: 0
  padding-top:16px

</style>
