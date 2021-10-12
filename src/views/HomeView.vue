<template>
  <div class="homeView">
    <Header v-if="showExperimentalTools">
      <ViewTitle icon="pelilauta">
        {{ $t('app.title') }}
      </ViewTitle>
    </Header>
    <div class="bookLayout">
      <HomeStream />
      <Column class="double-cut">
        <transition name="fade">
          <WelcomeCard v-if="anonymousSession" />
        </transition>
        <CreateASiteAd />
        <ForumsAd v-if="showExperimentalTools" />
      </Column>
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
import Column from '@/components/layout/Column.vue'
import Header from '@/components/layout/Header.vue'
import ViewTitle from '@/components/layout/ViewTitle.vue'
import ForumsAd from '@/components/home/cta/ForumsAd.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    Fab,
    HomeStream,
    ToTopFab,
    CreateASiteAd,
    WelcomeCard,
    Column,
    Header,
    ViewTitle,
    ForumsAd
  },
  setup () {
    const { showMemberTools, anonymousSession, showExperimentalTools } = useAuth()
    const editorDialog = ref(false)
    onMounted(() => {
      const a = getAnalytics()
      logEvent(a, 'PageView', { name: 'homeView' })
      document.title = 'Pelilauta'
    })

    return { editorDialog, showMemberTools, anonymousSession, showExperimentalTools }
  }
})
</script>
