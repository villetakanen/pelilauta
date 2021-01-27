<template>
  <div>
    <transition name="fade">
      <div
        v-if="site && site.id"
        class="suspense mekanismiGrid"
      >
        <MaterialCard class="mainCard">
          <h1>Attachments</h1>
          <div
            class="toolbar"
            style="margin-bottom: 16px"
          >
            <div class="spacer" />
            <AttachFileButton />
          </div>
          <div class="attachments">
            <AttachmentRow
              v-for="attachment, key in attachments"
              :key="key"
              :attachment="attachment[1]"
            />
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
import AttachmentRow from '@/components/sites/AttachmentRow.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    MaterialCard,
    Loader,
    SideBar,
    MekanismiBar,
    AttachFileButton,
    AttachmentRow
  },
  setup () {
    const { site } = useSite()
    const { attachments } = useFiles()
    provide('site', site)

    return { site, attachments }
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
