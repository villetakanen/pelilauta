<template>
  <ViewHeader v-if="!page">
    {{ $t('mekanismi.title') }}
  </ViewHeader>
  <transition name="fade">
    <PageToolbar
      v-if="page"
      :title="page.name"
      :subtitle="routeSiteid"
    />
  </transition>
  <div style="display:flex">
    <MaterialCard>
      <transition name="fade">
        <div
          v-if="page"
          :innerHTML="page.htmlContent"
        />
      </transition>
      <div
        v-if="!page"
        class="centerBlock"
      >
        <Loader />
      </div>
    </MaterialCard>
    <transition name="fade">
      <MaterialCard v-if="sideBar" style="min-width: 220px; flex-shrink: 0">
        <div
          :innerHTML="sideBar.htmlContent"
        />
      </MaterialCard>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import ViewHeader from '@/components/app/ViewHeader.vue'
import { useRoute } from 'vue-router'
import MaterialCard from '@/components/material/MaterialCard.vue'
import PageToolbar from '@/components/wikipage/PageToolbar.vue'
import { usePages } from '@/state/site'
import Loader from '@/components/app/Loader.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    ViewHeader,
    PageToolbar,
    MaterialCard,
    Loader
  },
  setup () {
    const { pages } = usePages()
    const page = computed(() => pages.value.find((p) => (p.id === routePageid.value)))
    const sideBar = computed(() => pages.value.find((p) => (p.id === 'sidebar')))
    const route = useRoute()
    const routePageid = computed(() => {
      return Array.isArray(route.params.pageid) ? route.params.pageid[0] : route.params.pageid
    })
    const routeSiteid = computed(() => {
      return Array.isArray(route.params.siteid) ? route.params.siteid[0] : route.params.siteid
    })

    return { page, routePageid, routeSiteid, sideBar }
  }
})
</script>

<style lang="sass" scoped>
.centerBlock
  display: flex
  justify-content: center

</style>
