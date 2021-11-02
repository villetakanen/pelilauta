<template>
  <nav
    id="NavigationRail"
    class="hideOnMobile"
  >
    <div
      class="appLogo"
      @click="reroute('/')"
    >
      <img src="@/assets/icons/dark/fox.svg">
    </div>
    <NavigationRailAction
      icon="send"
      :name="$t('discuss.title')"
      route-name="threads.home"
    />
    <NavigationRailAction
      icon="mekanismi"
      :name="$t('sites.index.title')"
      route-name="mekanismi"
    />
    <NavigationRailAction
      icon="adventurer"
      :name="$t('characters.title')"
      route-name="characters.home"
    />
    <SpacerDiv />
    <NavigationRailAction
      icon="lightbulb"
      :name="$t('sites.mainwiki.title')"
      route-name="mekanismi.mainwiki"
    />
    <NavigationRailAction
      icon="monsters"
      :name="$t('stylebook.title')"
      route-name="stylebook"
    />
    <NavigationRailAction
      icon="about"
      :name="$t('about.title')"
      route-name="about"
    />
    <SpacerDiv />
    <NavigationRailAction
      icon="avatar"
      :name="$t('profile.title')"
      route-name="profile"
    />
  </nav>
</template>

<script lang="ts">
import { useUxActions } from '@/composables/useUxActions'
import { defineComponent } from 'vue'
import SpacerDiv from '../layout/SpacerDiv.vue'
import NavigationRailAction from './NavigationRailAction.vue'

export default defineComponent({
  name: 'NavigationRail',
  components: { SpacerDiv, NavigationRailAction },
  setup () {
    const { reroute } = useUxActions()
    return {
      reroute
    }
  }
})
</script>

<style lang="sass" scoped>
#NavigationRail
  background: linear-gradient(-42deg, var(--chroma-secondary-a) 0%, var(--chroma-secondary-b) 100%)
  position: fixed
  width: 80px
  height: 100vh
  z-index: 10000
  display: flex
  flex-direction: column
  box-sizing: border-box
  padding-bottom: var(--baseline-height)
  gap: 12px
  .appLogo
    margin: 12px
    padding: 0
    width: calc(80px - 2 * 12px)
    height: calc(80px - 2 * 12px)
    &:hover
     filter: drop-shadow(0px 0px 7px rgba(255,255,255,0.22))
</style>
