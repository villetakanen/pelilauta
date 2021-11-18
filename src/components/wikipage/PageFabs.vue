<template>
  <teleport to="#ScreenBottomFabsContainer">
    <FabTray
      v-if="showTools"
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
import { useAuth } from '@/state/authz'
import { usePage } from '@/state/pages/usePage'
import { SiteClass, useSite } from '@/state/site'
import { computed, defineComponent } from 'vue'
import Fab3 from '../material3/Fab3.vue'
import FabTray from '../material3/FabTray.vue'

export default defineComponent({
  name: 'PageFabs',
  components: {
    Fab3,
    FabTray
  },
  setup () {
    const { site } = useSite()
    const { page } = usePage()
    const { user } = useAuth()
    const { reroute } = useUxActions()
    const showTools = computed(() => {
      return new SiteClass(site.value).isOwner(user.value.uid)
    })
    return {
      showTools,
      reroute,
      site,
      page
    }
  }
})
</script>
