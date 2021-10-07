<template>
  <div class="homeView bookLayout">
    <HomeStream />
    <div>
      <transition name="fade">
        <WelcomeCard v-if="anonymousSession" />
      </transition>
      <CreateASiteAd />
    </div>
    <teleport to="#ScreenBottomFabsContainer">
      <ToTopFab style="margin-right:8px" />
      <Fab
        v-if="showMemberTools"
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
import { useAuth } from '@/state/authz'
import HomeStream from '@/components/home/HomeStream.vue'
import ToTopFab from '@/components/app/ToTopFab.vue'
import { getAnalytics, logEvent } from '@firebase/analytics'
import CreateASiteAd from '@/components/home/cta/CreateASiteAd.vue'
import WelcomeCard from '@/components/home/WelcomeCard.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    Fab,
    HomeStream,
    ToTopFab,
    CreateASiteAd,
    WelcomeCard
  },
  setup () {
    const { showMemberTools, anonymousSession } = useAuth()
    const editorDialog = ref(false)
    onMounted(() => {
      const a = getAnalytics()
      logEvent(a, 'PageView', { name: 'homeView' })
      document.title = 'Pelilauta'
    })

    return { editorDialog, showMemberTools, anonymousSession }
  }
})
</script>

<style lang="sass" scoped>
.homeView
  padding-top: 8px
</style>
