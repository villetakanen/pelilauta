<template>
  <div class="sideNavMenu">
    <ul>
      <li
        v-for="item in sideNavItems"
        :key="item.key"
        :class="{ subtitle: item.sub }"
        @click="routeTo(item.to)"
      >
        <img
          v-if="item.icon === 'admin'"
          src="@/assets/icons/action-admin.svg"
        >
        <img
          v-if="item.icon === 'd12'"
          src="@/assets/icons/d12-black.svg"
        >
        <img
          v-if="item.icon === 'player'"
          src="@/assets/icons/player.svg"
        >
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useAuthz } from '@/lib/authz'
import { useProfile } from '@/state/authz'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'SideNavMenu',
  setup () {
    const { isAuthz } = useAuthz()
    const { isAdmin } = useProfile()
    const sideNavItems = computed(() => {
      const allNavItems = [
        { key: 'Home', text: 'Pelilauta', to: '/', icon: 'd12' },
        { key: 'Admin', text: 'Admin', admin: true, to: '/admin', icon: 'admin' },
        { key: 'Meta', text: 'Meta', sub: true },
        { key: 'StyleGuide', text: 'Styleguide', admin: true, to: '/styleguide', icon: 'admin' },
        { key: 'Profile', text: 'My Profile', authz: true, to: '/profile', icon: 'player' },
        { key: 'About', text: 'About', to: '/about', icon: 'd12' },
        { key: 'Sections', text: 'Sections', sub: true }
      ]
      return allNavItems.filter((val) => (
        isAdmin.value ||
        (isAuthz.value && val.authz) ||
        !(val.authz || val.admin))
      )
    })
    const router = useRouter()
    const routeTo = (to: string|undefined) => {
      if (!to) return
      router.push(to)
    }
    return { isAuthz, sideNavItems, routeTo }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.sideNavMenu
  margin: 8px 0
  padding: 0
  ul
    margin: 0
    padding: 0
  li
    @include TypeButton()
    margin: 0
    padding: 0
    list-style: none
    display: block
    // background-color: rgba(255,0,0,0.3)
    box-sizing: border-box
    height: 48px
    line-height: 48px
    padding-left: 16px
    img
      height: 32px
      width: 32px
      padding: 2px
      background-color: white
      border-radius: 18px
      vertical-align: middle
      margin-right: 8px
    &:hover
      background-color: rgba($color-fill-secondary, 0.5)
    &.subtitle
      color: $color-font-medium
      border-bottom: solid 1px $color-font-disabled
      margin: 0 16px
      padding-left: 0

@include media('=<tablet')
  .sideNavMenu
    margin: 8px 0

</style>
