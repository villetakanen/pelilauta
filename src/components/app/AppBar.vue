<template>
  <div
    id="AppBar"
    class="toolbar"
  >
    <SideNavAction class="onlyForMobile" />
    <AppAction />
    <div class="spacer" />
    <AppBarSearch v-if="!isAnonymous" />
    <InboxAction />
    <Action
      :disabled="isAnonymous"
      prepend="avatar"
      to="/profile"
    >
      <span
        class="hideOnMobile"
      >
        {{ $t('sideNav.profile') }}
      </span>
    </Action>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue'
import SideNavAction from '@/components/sidenav/SideNavAction.vue'
import { useAuthState } from '@/state/authz'
import { useRoute } from 'vue-router'
import AppAction from './AppAction.vue'
import Action from '../material/Action.vue'
import AppBarSearch from './AppBarSearch.vue'
import InboxAction from '../inbox/InboxAction.vue'

export default defineComponent({
  name: 'AppBar',
  components: {
    SideNavAction,
    AppAction,
    Action,
    AppBarSearch,
    InboxAction
  },
  setup () {
    const { isAdmin, isAnonymous } = useAuthState()
    const mobileViewport = inject('mobileViewport')
    const route = useRoute()
    const mekanismi = computed(() => ((route.name || '').toString().split('.')[0] === 'mekanismi'))
    return { isAdmin, mobileViewport, mekanismi, isAnonymous }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

#AppBar
  // box-shadow: 0 0 13px 0 var(--chroma-secondary-h)
  position: relative
  background: var(--chroma-clear) // linear-gradient(140deg, var(--chroma-primary-a) 0%, var(--chroma-primary-e) 100%) // linear-gradient(127deg, rgba(0,121,107,1) 0%, rgba(0,200,83,1) 100%)
  height: 48px
  margin: 0
  margin-bottom: 0px
  // border-bottom: solid 1px var(--chroma-primary-e)
  padding: 4px
  display: flex
  z-index: 100

@include media('>phone')

</style>
