<template>
  <div
    id="AppBar"
    class="toolbar"
  >
    <SideNavAction class="onlyForMobile" />
    <AppAction />
    <div class="spacer" />
    <AppBarSearch v-if="showMemberTools" />
    <InboxAction />
    <AppBarAction
      v-if="!anonymousSession"
      icon="avatar"
      to="/profile"
      :label="$t('sideNav.profile') "
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue'
import SideNavAction from '@/components/sidenav/SideNavAction.vue'
import { useAuth } from '@/state/authz'
import { useRoute } from 'vue-router'
import AppAction from './AppAction.vue'
import AppBarAction from './AppBarAction.vue'
import AppBarSearch from './AppBarSearch.vue'
import InboxAction from '../inbox/InboxAction.vue'

export default defineComponent({
  name: 'AppBar',
  components: {
    SideNavAction,
    AppAction,
    AppBarAction,
    AppBarSearch,
    InboxAction
  },
  setup () {
    const { anonymousSession, showMemberTools } = useAuth()
    const mobileViewport = inject('mobileViewport')
    const route = useRoute()
    const mekanismi = computed(() => ((route.name || '').toString().split('.')[0] === 'mekanismi'))
    return { mobileViewport, mekanismi, anonymousSession, showMemberTools }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

#AppBar
  position: relative
  background: var(--chroma-clear)
  height: 48px
  margin: 0
  margin-bottom: 0px
  padding: 3px
  display: flex
  z-index: 100
  border-bottom: solid 1px var(--chroma-secondary-g)

</style>
