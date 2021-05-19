<template>
  <div class="viewPage">
    <SiteToolbar :page="page" />
    <div class="mekanismiGrid">
      <div class="mainCard">
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
      </div>
      <Card
        class="sideCard"
        :rise="3"
      >
        <transition name="fade">
          <SideBar v-if="site.name" />
          <Loader
            v-else
            poster
          />
        </transition>
        <SiteThreadList
          v-if="site.name"
          :siteid="site.id"
        />
      </Card>
    </div>
    <PageFabs />
  </div>
</template>

<script lang="ts">
import { ComputedRef, defineComponent, inject, provide } from 'vue'
import SideBar from '@/components/wikipage/SideBar.vue'
import { usePages, useSite } from '@/state/site'
import Loader from '@/components/app/Loader.vue'
import PageFabs from '@/components/wikipage/PageFabs.vue'
import SiteToolbar from '@/components/sites/SiteToolbar.vue'
import { renderWikiLinks } from '@/utils/contentFormat'
import Card from '@/components/layout/Card.vue'
import SiteThreadList from '@/components/site/threads/SiteThreadList.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    Loader,
    SideBar,
    PageFabs,
    SiteToolbar,
    Card,
    SiteThreadList
  },
  setup () {
    const { site } = useSite()
    const { page, pages } = usePages()

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
