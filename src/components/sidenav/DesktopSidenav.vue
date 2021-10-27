<template>
  <nav
    v-if="showExperimentalTools"
    id="DesktopSidenav"
    class="hideOnMobile"
  >
    <ul class="sideNavMenu">
      <li>
        <Action
          dark
          prepend="pelilauta"
          to="/"
        >
          Pelilauta
        </Action>
      </li>
      <li>
        <Action
          dark
          prepend="discussion"
          to="/threads"
        >
          {{ $t('threads.home.title') }}
        </Action>
      </li>
      <li>
        <Action
          dark
          prepend="mekanismi"
          to="/mekanismi"
        >
          {{ $t('sites.home.title') }}
        </Action>
      </li>
      <li>
        <Action
          dark
          prepend="avatar"
          to="/profile"
        >
          {{ $t('profile.title') }}
        </Action>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { useAuth } from '@/state/authz'
import { defineComponent } from 'vue'
import Action from '../material/Action.vue'

export default defineComponent({
  name: 'DesktopSidenav',
  components: { Action },
  setup () {
    const { showExperimentalTools } = useAuth()
    return { showExperimentalTools }
  }
})
</script>

<style lang="sass" scoped>
#DesktopSidenav
  background-color: var(--chroma-secondary-a)
  position: fixed
  top: 0
  left: 0
  height: 100vh
  width: 270px
  z-index: 100000
  .sideNavMenu
    margin:0
    padding: 12px
    li
      list-style-type: none
      margin: 0
      padding: 0
</style>
