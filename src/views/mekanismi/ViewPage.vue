<template>
  <div>
    <SiteToolbar />
    <div class="mekanismiGrid">
      <MaterialCard class="mainCard">
        <PageToolbar />
        <transition name="fade">
          <div v-if="site.name && page.name">
            <div
              class="wikipage"
              :innerHTML="renderWikiLinks(site.id, page.htmlContent)"
            />
          </div>
          <Loader
            v-else
            poster
            style="margin-bottom: -80px"
          />
        </transition>
      </MaterialCard>
      <MaterialCard class="sideCard">
        <transition name="fade">
          <SideBar v-if="site.name" />
          <Loader
            v-else
            poster
          />
        </transition>
      </MaterialCard>
    </div>
    <PageFabs />
  </div>
</template>

<script lang="ts">
import { ComputedRef, defineComponent, inject, provide } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import PageToolbar from '@/components/wikipage/PageToolbar.vue'
import SideBar from '@/components/wikipage/SideBar.vue'
import { usePages, useSite } from '@/state/site'
import Loader from '@/components/app/Loader.vue'
// import { useRoute } from 'vue-router'
import PageFabs from '@/components/wikipage/PageFabs.vue'
import SiteToolbar from '@/components/sites/SiteToolbar.vue'
import { renderWikiLinks } from '@/utils/contentFormat'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    PageToolbar,
    MaterialCard,
    Loader,
    SideBar,
    PageFabs,
    SiteToolbar
  },
  setup () {
    const { site } = useSite()
    const { page, pages } = usePages()

    // const route = useRoute()
    const mobileViewport = inject('mobileViewport') as ComputedRef<boolean>

    provide('site', site)
    provide('page', page)
    provide('pages', pages)

    /* watch(() => route.params, (r) => {
      const id = Array.isArray(r.siteid) ? r.siteid[0] : r.siteid || ''
      // subscribeTo(id)

      const pid = Array.isArray(r.pageid) ? r.pageid[0] : r.pageid || ''
      fetchPage(pid || id)
    }, { immediate: true }) */

    return { page, site, mobileViewport, renderWikiLinks }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.mainCard
  min-height: 152px
.wikipage
  margin: 0
  padding: 0
  p
    margin-top: 0
    margin-block-start: 0
</style>
