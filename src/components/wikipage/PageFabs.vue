<template>
  <teleport to="#ScreenBottomFabsContainer">
    <FabTray
      v-if="showSiteMemberTools"
      class="PageFabs"
    >
      <Fab3
        :icon="'edit'"
        :label="$t('action.edit')"
        @click="reroute('/site/' + site.id + '/page/' +page.id + '/edit')"
      />
    </FabTray>
  </teleport>
</template>

<script lang="ts">
import { useUxActions } from '@/composables/useUxActions'
import { usePage } from '@/state/pages/usePage'
import { useSite } from '@/state/site'
import { defineComponent } from 'vue'
import Fab3 from '../material3/Fab3.vue'
import FabTray from '../material3/FabTray.vue'

export default defineComponent({
  name: 'PageFabs',
  components: {
    Fab3,
    FabTray
  },
  setup () {
    const { site, showSiteMemberTools } = useSite()
    const { page } = usePage()
    const { reroute } = useUxActions()
    return {
      showSiteMemberTools,
      reroute,
      site,
      page
    }
  }
})
</script>
