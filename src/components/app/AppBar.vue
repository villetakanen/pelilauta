<template>
  <div id="AppBar" class="toolbar">
    <SideNavAction />
    <h1>
      <router-link to="/">
        {{ $t('app.title') }}
      </router-link>
    </h1>
    <div class="spacer" />
    <AppBarSearch />
    <ProfileAction />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SideNavAction from '@/components/app/SideNavAction.vue'
import ProfileAction from '@/components/ProfileAction.vue'
import AppBarSearch from './AppBarSearch.vue'

export default defineComponent({
  name: 'AppBar',
  components: {
    SideNavAction,
    ProfileAction,
    AppBarSearch
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

#AppBar
  background-color: $color-fill-dark
  background: linear-gradient(127deg, rgba(0,121,107,1) 0%, rgba(0,200,83,1) 100%)
  position: fixed
  top: 0
  left: 0
  z-index: 1000
  width: 100vw
  height: 56px // 24 x 2 lines
  padding: 4px
  box-sizing: border-box
  display: flex
  // box-shadow: 0px 7px 15px 0px rgba($color-fill-primary-dark, .37)
  h1
    @include TypeButton()
    margin-left: 56px
    line-height: 48px
    a
      color: $color-dark-font-high
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
  z-index: 100000

@include media('<=tablet')
  .searchBar
    width: 102px
    transition: width 0.3s ease
    &:focus
      width: 57vw

</style>
