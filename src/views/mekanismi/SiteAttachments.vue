<template>
  <div>
    <transition name="fade">
      <div
        v-if="site && site.id"
        class="suspense mekanismiGrid"
      >
        <MaterialCard class="mainCard">
          <h1>Attachments</h1>
          <div class="toolbar" style="margin-bottom: 16px">
            <div class="spacer" />
            <AttachFileButton />
          </div>
          <div
            v-for="file in files"
            :key="file[1]"
          >
            {{ file[0] }} - <img
              :src="file[1]"
              style="max-height: 128px; max-width: 128px"
              :alt="file[0]"
            >
          </div>
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
import { defineComponent, provide } from 'vue'
import { useSite, useFiles } from '@/state/site'
import MaterialCard from '@/components/material/MaterialCard.vue'
import Loader from '@/components/app/Loader.vue'
import SideBar from '@/components/wikipage/SideBar.vue'
import MekanismiBar from '@/components/app/MekanismiBar.vue'
import AttachFileButton from '@/components/sites/AttachFileButton.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    MaterialCard,
    Loader,
    SideBar,
    MekanismiBar,
    AttachFileButton
  },
  setup () {
    const { site } = useSite()
    const { files } = useFiles()
    provide('site', site)

    return { site, files }
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
