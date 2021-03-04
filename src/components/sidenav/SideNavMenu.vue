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
          alt="admin"
        >
        <img
          v-if="item.icon === 'd12'"
          src="@/assets/icons/d12-black.svg"
          alt="d12"
        >
        <img
          v-if="item.icon === 'mekanismi'"
          src="@/assets/icons/d6-black.svg"
          alt="mekanismi"
        >
        <img
          v-if="item.icon === 'd20'"
          src="@/assets/icons/d20-black.svg"
          alt="d20"
        >
        <img
          v-if="item.icon === 'discussion'"
          src="@/assets/icons/discussion.svg"
          alt="discussion"
        >
        <img
          v-if="item.icon === 'monsters'"
          src="@/assets/themes/monsters.svg"
          alt="monsters"
        >
        <img
          v-if="item.icon === 'player'"
          src="@/assets/icons/player.svg"
          alt="player"
        >
        {{ item.content || $t('sideNav.' + item.key) }}
        <div
          v-if="item.secondaryContent"
          class="secondaryContent"
        >
          {{ item.secondaryContent }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue'
import { useAuthState, useProfile } from '@/state/authz'
import { useRouter } from 'vue-router'
import { useMeta } from '@/state/meta'

interface NavItem {
  key: string;
  to?: string;
  icon?: string;
  admin?: boolean,
  sub?: boolean,
  authz?: boolean
  content?: string
  secondaryContent?: string
}

export default defineComponent({
  name: 'SideNavMenu',
  setup () {
    const { isAnonymous } = useAuthState()
    const { isAdmin } = useProfile()
    const { streams } = useMeta()
    const sideNavItems = computed(() => {
      const allNavItems: NavItem[] = [
        { key: 'home', to: '/', icon: 'd12' }
      ]
      allNavItems.push({ key: 'mekanismi', to: '/mekanismi', icon: 'mekanismi' })
      // allNavItems.push({ key: 'admin', admin: true, to: '/admin', icon: 'admin' })
      allNavItems.push({ key: 'sections', sub: true })
      streams.value.forEach((topic) => {
        if (topic.slug !== '-') {
          allNavItems.push({
            key: topic.slug,
            content: topic.name,
            to: '/stream/topic/' + topic.slug,
            icon: topic.icon || 'd20',
            secondaryContent: topic.count.toString()
          })
        }
      })
      // Meta items start
      allNavItems.push({ key: 'meta', sub: true })
      // allNavItems.push({ key: 'stylebook', admin: true, to: '/styleguide', icon: 'admin' })
      allNavItems.push({ key: 'editorTest', to: '/editortest', admin: true, icon: 'admin' })
      allNavItems.push({ key: 'profile', authz: true, to: '/profile', icon: 'player' })
      allNavItems.push({ key: 'about', to: '/mekanismi/view/mekanismi/pelilauta-about', icon: 'd12' })
      return allNavItems.filter((val) => (
        isAdmin.value ||
        (!isAnonymous.value && val.authz) ||
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
    return { sideNavItems, routeTo }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

.sideNavMenu
  margin: 8px 0
  padding: 0
  padding-top: 8px
  overflow: hidden
  overflow-y: scroll
  ul
    margin: 0
    padding: 0
  li
    @include TypeButton()
    margin: 0
    padding: 0
    list-style: none
    display: block
    box-sizing: border-box
    height: 48px
    line-height: 48px
    padding-left: 16px
    position: relative
    div.secondaryContent
      color: var(--chroma-secondary-a)
      background-color: var(--chroma-primary-h)
      padding: 0 10px
      border-radius: 12px
      position: absolute
      right: 16px
      top: 12px
      height: 22px
      line-height: 22px
    img
      height: 32px
      width: 32px
      padding: 2px
      background-color: white
      border-radius: 18px
      vertical-align: middle
      margin-right: 8px
    &:hover
      background-color: #{'rgba(var(--chroma-primary-c-rgba), 0.22)'}
      border-radius: 0 24px 24px 0
      div.secondaryContent
        background-color: var(--chroma-primary-e)
        color: var(--chroma-clear)
    &.subtitle
      color: var(--chroma-secondary-g)
      border-bottom: solid 1px var(--chroma-secondary-f)
      margin: 0 16px
      padding-left: 0
      &:hover
        background: none
        border-radius: 0

@include media('=<tablet')
  .sideNavMenu
    margin: 8px 0

</style>
