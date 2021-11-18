<template>
  <div class="sideNavMenu">
    <ul>
      <SideNavMenuItem
        icon="pelilauta"
        to="/"
        @click="toggleNav"
      >
        {{ $t('app.title') }}
      </SideNavMenuItem>
      <SideNavMenuItem
        icon="addDiscussion"
        to="/threads"
        @click="toggleNav"
      >
        {{ $t('threads.home.title') }}
      </SideNavMenuItem>
      <SideNavMenuItem
        icon="mekanismi"
        to="/mekanismi"
        @click="toggleNav"
      >
        {{ $t('sites.home.title') }}
      </SideNavMenuItem>

      <template v-if="showMemberTools">
        <li class="subtitle">
          {{ $t('sidenav.vault') }}
        </li>
        <SideNavMenuItem
          icon="attachments"
          to="/profile/media"
          @click="toggleNav"
        >
          {{ $t('vault.media.title') }}
        </SideNavMenuItem>
        <SideNavMenuItem
          icon="adventurer"
          :to="`/u/${user.uid}/characters`"
          @click="toggleNav"
        >
          {{ $t('vault.characters.title') }}
        </SideNavMenuItem>
      </template>

      <li class="subtitle">
        Meta
      </li>
      <SideNavMenuItem
        icon="d20"
        to="/site/mekanismi"
        @click="toggleNav"
      >
        Wiki
      </SideNavMenuItem>
      <SideNavMenuItem
        icon="homebrew-logo"
        to="/site/arkku"
        @click="toggleNav"
      >
        Arkku
      </SideNavMenuItem>

      <SideNavMenuItem
        icon="about"
        to="/site/mekanismi/page/pelilauta-about"
        @click="toggleNav"
      >
        {{ $t('about.title') }}
      </SideNavMenuItem>

      <template v-if="showAdminTools">
        <li class="subtitle">
          Admin
        </li>
        <SideNavMenuItem
          icon="admin"
          to="/admin"
          @click="toggleNav"
        >
          {{ $t('admin.title') }}
        </SideNavMenuItem>
        <SideNavMenuItem
          icon="pelilauta"
          to="/stylebook"
          @click="toggleNav"
        >
          Stylebook
        </SideNavMenuItem>
      </template>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue'
import { useAuth } from '@/state/authz'
import { useRouter } from 'vue-router'
import { useMeta } from '@/state/meta'
import SideNavMenuItem from './SideNavMenuItem.vue'

export default defineComponent({
  name: 'SideNavMenu',
  components: { SideNavMenuItem },
  setup () {
    const { showMemberTools, showAdminTools, user, showExperimentalTools } = useAuth()
    const { streams } = useMeta()

    const streamItems = computed(() => {
      if (!streams.value) return []
      return streams.value.filter((stream) => (stream.slug !== '-')).map((stream) => {
        return {
          key: stream.slug,
          content: stream.name,
          to: '/threads/' + stream.slug,
          count: stream.count.toString(),
          icon: stream.icon
        }
      })
    })

    const router = useRouter()
    const toggleNav: CallableFunction = inject('toggleNav') as CallableFunction
    const routeTo = (to: string|undefined) => {
      if (!to) return
      if (window.innerWidth < 768) toggleNav()
      router.push(to)
    }
    return { routeTo, streamItems, showMemberTools, toggleNav, showAdminTools, user, showExperimentalTools }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

.streamLink
  margin: 0
  padding: 0
  display: inline-block
  position: relative
  width: calc(100% - 60px)
  .count
    position: absolute
    color: var(--chroma-secondary-a)
    background-color: var(--chroma-primary-h)
    padding: 0 10px
    border-radius: 12px
    right: 16px
    top: 12px
    height: 22px
    line-height: 22px

.navItemIcon
  position: relative
  background-color: var(--chroma-clear)
  border-radius: 50%
  margin-right: 12px

.sideNavMenu
  margin: 0
  padding: 0
  padding-top: 8px
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
    padding-left: 6px
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
    &:hover
      border-radius: 0 24px 24px 0
      div.secondaryContent
        background-color: var(--chroma-primary-e)
        color: var(--chroma-clear)
    &.subtitle
      color: var(--chroma-secondary-d)
      border-bottom: solid 1px var(--chroma-secondary-g)
      margin: 0 16px
      padding-left: 8px
      &:hover
        background: none
        border-radius: 0

@include media('<tablet')
  .sideNavMenu
    margin: 8px 0
    overflow: hidden
    overflow-y: scroll

</style>
