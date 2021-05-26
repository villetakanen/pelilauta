<template>
  <div id="ScreenBottomFloatContainer">
    <div id="ScreenBottomFloatLeft">
      <slot name="left" />
    </div>
    <div id="ScreenBottomFloatRight">
      <div id="ScreenBottomFabsContainer" />
      <slot name="right" />
      <Fab
        v-if="isAnonymous"
        to="/login"
        :text="$t('action.login')"
        dark
        icon="avatar"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Fab from '@/components/material/Fab.vue'
import { useAuthState } from '@/state/authz'

export default defineComponent({
  name: 'BottomFloatContainer',
  components: {
    Fab
  },
  setup () {
    const { isAnonymous } = useAuthState()
    return { isAnonymous }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss

div#ScreenBottomFloatContainer
  position: fixed
  bottom: 0
  left: 0
  width: 100vw
  height: auto
  box-sizing: border-box
  margin: 0
  padding: 16px
  z-index: 10000
  pointer-events: none
  div
    pointer-events: all
  div#ScreenBottomFloatRight
    text-align: right
    display: flex
    div#ScreenBottomFabsContainer
      text-align: right
      display: flex

@include media('<tablet')
  div#ScreenBottomFloatContainer
    display: flex
    flex-direction: column
    align-items: flex-end
    div#ScreenBottomFloatLeft
      padding-bottom: 16px
    div#ScreenBottomFloatRight
      text-align: center
      align-items: center
      display: flex

@include media('>=tablet')
  div#ScreenBottomFloatContainer
    display: flex
    flex-wrap: nowrap
    justify-content: space-between
    align-items: flex-end

</style>
