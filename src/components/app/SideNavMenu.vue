<template>
  <div class="sideNavMenu">
    <ul>
      <li
        v-for="item in sideNavItems"
        :key="item.key"
        @click="routeTo(item.to)"
      >
        <img v-if="item.icon === 'admin'" src="@/assets/icons/action-admin.svg">
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useAuthz } from '@/lib/authz'
import { useProfile } from '@/state/authz'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'SideNavMenu',
  setup () {
    const { isAuthz } = useAuthz()
    const { isAdmin } = useProfile()
    const allNavItems = ref([
      { key: 'StyleGuide', text: 'Styleguide', admin: true, to: '/styleguide', icon: 'admin' }
    ])
    const sideNavItems = computed(() => {
      return allNavItems.value.filter((val) => (isAdmin.value || !val.admin))
    })
    const router = useRouter()
    const routeTo = (to: string) => {
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

@include media('=<tablet')
  .sideNavMenu
    margin: 8px 0

</style>
