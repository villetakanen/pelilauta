<template>
  <div
    id="AppBar"
    class="toolbar"
  >
    <SideNavAction />
    <AppAction style="margin-left: 56px" />
    <div class="spacer" />
    <Action
      v-if="isAdmin"
      prepend="admin"
      to="/admin"
      style="margin: 8px"
    >
      <template
        v-if="!mobileViewport"
      >
        {{ $t('action.admin') }}
      </template>
    </Action>
    <AppModeSwitchAction />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue'
import SideNavAction from '@/components/sidenav/SideNavAction.vue'
import { useAuthState } from '@/state/authz'
import { useRoute } from 'vue-router'
import AppAction from './AppAction.vue'
import Action from '../material/Action.vue'
import AppModeSwitchAction from './AppModeSwitchAction.vue'

export default defineComponent({
  name: 'AppBar',
  components: {
    SideNavAction,
    AppAction,
    Action,
    AppModeSwitchAction
  },
  setup () {
    const { isAdmin } = useAuthState()
    const mobileViewport = inject('mobileViewport')
    const route = useRoute()
    const mekanismi = computed(() => ((route.name || '').toString().split('.')[0] === 'mekanismi'))
    return { isAdmin, mobileViewport, mekanismi }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

#AppBar
  .absoluteRight
    position: absolute
    top: 0px
    right: 0px

.labelForSearch
  height: 30px
  width: 30px
  position: absolute
  top: 8px
  right: 55px
  background-color: $color-primary
  padding: 5px
  border-radius: 50%
  opacity: 50%
  z-index: 10

@include media('<=tablet')
  .searchBar
    width: 102px
    transition: width 0.3s ease
    &:focus
      width: 57vw

// Cleared from this on

#AppBar
  // box-shadow: 0 0 13px 0 var(--chroma-secondary-h)
  position: relative
  background-color: $color-fill-dark
  background: var(--chroma-clear) // linear-gradient(140deg, var(--chroma-primary-a) 0%, var(--chroma-primary-e) 100%) // linear-gradient(127deg, rgba(0,121,107,1) 0%, rgba(0,200,83,1) 100%)
  height: 56px
  margin: 0
  margin-bottom: 8px
  padding: 4px
  box-sizing: border-box
  display: flex
  z-index: 100
  h1
    @include TypeButton()
    margin-left: 56px
    line-height: 48px
    a
      color: $color-dark-font-high

@include media('>phone')

</style>
