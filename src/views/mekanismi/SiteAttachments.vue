<template>
  <div>
    <transition name="fade">
      <div
        v-if="site && site.id"
        class="suspense mekanismiGrid"
      >
        <MaterialCard class="mainCard">
          <h1>Attachments</h1>
        </MaterialCard>
        <MaterialCard class="sideCard">
          <SideBar />
        </MaterialCard>
      </div>
      <Loader
        v-else
        class="absoluteCenter"
      />
    </transition>
    <teleport to="#AppBarSubmenu">
      <MekanismiBar />
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, watch } from 'vue'
import { useSite, subscribeTo } from '@/state/site'
import { useRoute } from 'vue-router'
import MaterialCard from '@/components/material/MaterialCard.vue'
import Loader from '@/components/app/Loader.vue'
import SideBar from '@/components/wikipage/SideBar.vue'
import MekanismiBar from '@/components/app/MekanismiBar.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    MaterialCard,
    Loader,
    SideBar,
    MekanismiBar
  },
  setup () {
    const { site } = useSite()
    const route = useRoute()
    provide('site', site)
    watch(() => route.params, (r) => {
      const id = Array.isArray(r.siteid) ? r.siteid[0] : r.siteid || ''
      subscribeTo(id)
    }, { immediate: true })
    return { site }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.suspense
  position: relative
  .absoluteCenter
    position: absolute
    left: 50%
    top: 16px

</style>
