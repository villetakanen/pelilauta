<template>
  <div class="homeView singleColumnLayout">
    <HomeStream />
    <teleport to="#ScreenBottomFabsContainer">
      <ToTopFab style="margin-right:8px" />
      <Fab
        v-if="!isAnonymous"
        id="addThreadFab"
        to="/stream/add/thread"
        :text="$t('action.addThread')"
        icon="addDiscussion"
      />
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import Fab from '@/components/material/Fab.vue'
import { useAuthState } from '@/state/authz'
import HomeStream from '@/components/home/HomeStream.vue'
import ToTopFab from '@/components/app/ToTopFab.vue'
import { getAnalytics, logEvent } from 'firebase/analytics'

export default defineComponent({
  name: 'HomeView',
  components: {
    Fab,
    HomeStream,
    ToTopFab
  },
  setup () {
    const { isAnonymous } = useAuthState()
    const editorDialog = ref(false)
    onMounted(() => {
      const a = getAnalytics()
      logEvent(a, 'PageView', { name: 'homeView' })
      document.title = 'Pelilauta'
    })

    return { editorDialog, isAnonymous }
  }
})
</script>

<style lang="sass" scoped>
.homeView
  padding-top: 8px
</style>
