<template>
  <div class="sideNavMenu" v-if="false">
    <ul>
      <li>SideNavMenu</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuthz } from '@/lib/authz'

export default defineComponent({
  name: 'SideNavMenu',
  setup () {
    const { isAuthz } = useAuthz()
    return { isAuthz }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.sideNavMenu
  margin: 16px 0
  li
    margin: 0
    padding: 0
    list-style: none
    display: block
    &:hover
      background-color: rgba($color-fill-secondary, 0.37)

@include media('=<tablet')
  .sideNavMenu
    margin: 8px 0

</style>
