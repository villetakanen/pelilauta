<template>
  <div id="ScreenBottomFloatContainer">
    <div id="ScreenBottomFloatLeft">
      <slot name="left" />
    </div>
    <div id="ScreenBottomFloatRight">
      <Fab
        v-if="isAnonymous"
        to="/login"
        :text="$t('action.login')"
        color="tertiary"
      >
        <Icon
          name="avatar"
          color="dark"
        />
      </Fab>
      <slot name="right" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Fab from '@/components/material/Fab.vue'
import Icon from '@/components/material/Icon.vue'
import { useAuthState } from '@/state/authz'

export default defineComponent({
  name: 'BottomFloatContainer',
  components: {
    Fab, Icon
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
  div#ScreenBottomFloatRight
    text-align: right

@include media('<tablet')
  div#ScreenBottomFloatContainer
    div#ScreenBottomFloatLeft
      padding-bottom: 16px
    div#ScreenBottomFloatRight
      text-align: center

@include media('>=tablet')
  div#ScreenBottomFloatContainer
    display: flex
    flex-wrap: nowrap
    justify-content: space-between
    align-items: flex-end

</style>
