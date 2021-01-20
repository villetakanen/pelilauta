<template>
  <div>
    <transition name="fade">
      <div v-if="site.name && page.name">
        <PageToolbar />
        <div class="mekanismiGrid">
          <div class="mainCard">
            <div
              class="wikipage"
              :innerHTML="page.htmlContent"
            />
          </div>
          <MaterialCard class="sideCard">
            <SideBar />
          </MaterialCard>
        </div>
      </div>
      <Loader
        v-else
        class="toCenter"
      />
    </transition>
    <PageFabs />
    <teleport to="#AppBarSubmenu">
      <MekanismiBar />
    </teleport>
  </div>
</template>

<script lang="ts">
import { ComputedRef, defineComponent, inject, provide, watch } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import PageToolbar from '@/components/wikipage/PageToolbar.vue'
import SideBar from '@/components/wikipage/SideBar.vue'
import { usePages, useSite, subscribeTo, fetchPage } from '@/state/site'
import Loader from '@/components/app/Loader.vue'
import { useRoute } from 'vue-router'
import PageFabs from '@/components/wikipage/PageFabs.vue'
import MekanismiBar from '@/components/app/MekanismiBar.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    PageToolbar,
    MaterialCard,
    Loader,
    SideBar,
    PageFabs,
    MekanismiBar
  },
  setup () {
    const { site } = useSite()
    const { page, pages } = usePages()

    const route = useRoute()
    const mobileViewport = inject('mobileViewport') as ComputedRef<boolean>

    provide('site', site)
    provide('page', page)
    provide('pages', pages)

    watch(() => route.params, (r) => {
      const id = Array.isArray(r.siteid) ? r.siteid[0] : r.siteid || ''
      subscribeTo(id)

      const pid = Array.isArray(r.pageid) ? r.pageid[0] : r.pageid || ''
      fetchPage(pid || id)
    }, { immediate: true })

    return { page, site, mobileViewport }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.wikipage
  margin: 0
  padding: 0 16px
  p
    margin-top: 0
    margin-block-start: 0
</style>
