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
          v-if="item.icon === 'mekanismi'"
          src="@/assets/icons/d6-black.svg"
        >
        <img
          v-if="item.icon === 'd20'"
          src="@/assets/icons/d20-black.svg"
        >
        <img
          v-if="item.icon === 'discussion'"
          src="@/assets/icons/discussion.svg"
        >
        <img
          v-if="item.icon === 'monsters'"
          src="@/assets/themes/monsters.svg"
        >
        <img
          v-if="item.icon === 'player'"
          src="@/assets/icons/player.svg"
        >
        {{ item.content || $t('sideNav.' + item.key) }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue'
import { useAuthz } from '@/lib/authz'
import { useProfile } from '@/state/authz'
import { useRouter } from 'vue-router'
import { useMeta } from '@/lib/meta'

interface NavItem {
  key: string;
  to?: string;
  icon?: string;
  admin?: boolean,
  sub?: boolean,
  authz?: boolean
  content?: string
}

export default defineComponent({
  name: 'SideNavMenu',
  setup () {
    const { isAuthz } = useAuthz()
    const { isAdmin } = useProfile()
    const { topics } = useMeta()
    const sideNavItems = computed(() => {
      const allNavItems: NavItem[] = [
        { key: 'home', to: '/', icon: 'd12' }
      ]
      allNavItems.push({ key: 'mekanismi', to: '/mekanismi', icon: 'mekanismi' })
      allNavItems.push({ key: 'admin', admin: true, to: '/admin', icon: 'admin' })
      allNavItems.push({ key: 'sections', sub: true })
      topics.value.forEach((topic) => {
        allNavItems.push({
          key: topic.slug,
          content: topic.title,
          to: '/stream/topic/' + topic.slug,
          icon: topic.icon || 'd20'
        })
      })
      // Meta items start
      allNavItems.push({ key: 'meta', sub: true })
      allNavItems.push({ key: 'stylebook', admin: true, to: '/styleguide', icon: 'admin' })
      allNavItems.push({ key: 'editorTest', to: '/editortest', admin: true, icon: 'admin' })
      allNavItems.push({ key: 'profile', authz: true, to: '/profile', icon: 'player' })
      allNavItems.push({ key: 'about', to: '/about', icon: 'd12' })
      return allNavItems.filter((val) => (
        isAdmin.value ||
        (isAuthz.value && val.authz) ||
        !(val.authz || val.admin))
      )
    })
    const router = useRouter()
    const toggleNav: CallableFunction = inject('toggleNav') as CallableFunction
    const routeTo = (to: string|undefined) => {
      if (!to) return
      if (window.innerWidth < 768) toggleNav()
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
