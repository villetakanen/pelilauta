<template>
  <div>
    <ViewHeader v-if="!page">
      {{ $t('mekanismi.title') }}
    </ViewHeader>
    <transition name="fade">
      <PageToolbar
        v-if="page"
        :title="page.name"
        :subtitle="site.name"
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

      <MaterialCard style="width: 220px; flex-shrink: 0">
        <SideBar />
        <p class="caption">
          Site settings available via <br>
          <a :href="'https://mekanismi.web.app/#/c/site/'+site.siteid">mekanismi.web.app</a>
        </p>
      </MaterialCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import ViewHeader from '@/components/app/ViewHeader.vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import PageToolbar from '@/components/wikipage/PageToolbar.vue'
import SideBar from '@/components/wikipage/SideBar.vue'
import { usePages, useSite } from '@/state/site'
import Loader from '@/components/app/Loader.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    ViewHeader,
    PageToolbar,
    MaterialCard,
    Loader,
    SideBar
  },
  setup () {
    const { site } = useSite()
    const { page, pages } = usePages()

    onMounted(() => {
      console.log(pages, page)
    })

    return { page, site }
  }
})
</script>

<style lang="sass" scoped>
.centerBlock
  display: flex
  justify-content: center

</style>
