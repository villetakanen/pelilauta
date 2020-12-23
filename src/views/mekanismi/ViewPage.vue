<template>
  <div>
    <transition name="fade">
      <div v-if="site.name && page.name">
        <PageToolbar />
        <div class="mekanismiGrid">
          <MaterialCard class="mainCard">
            <div :innerHTML="page.htmlContent" />
          </MaterialCard>
          <MaterialCard class="sideCard">
            <SideBar />
            <p class="caption">
              Site settings available via <br>
              <a :href="'https://mekanismi.web.app/#/c/site/'+site.siteid">mekanismi.web.app</a>
            </p>
          </MaterialCard>
        </div>
      </div>
      <Loader
        v-else
        class="toCenter"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import PageToolbar from '@/components/wikipage/PageToolbar.vue'
import SideBar from '@/components/wikipage/SideBar.vue'
import { usePages, useSite } from '@/state/site'
import Loader from '@/components/app/Loader.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
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
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.mekanismiGrid
    position: relative
    .mainCard
      overflow: hidden
      word-break: break-word
    .sideCard
      overflow: hidden
      word-break: break-word

@include media('>tablet')
  .mekanismiGrid
    .mainCard
      margin-right: 264px
    .sideCard
      position: absolute
      width: 220px
      top: 0px
      right: 0
</style>
