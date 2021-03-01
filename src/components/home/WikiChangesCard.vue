<template>
  <div class="wikiChangesCard">
    <img
      class="logo"
      :alt="$t('site.title')"
      src="@/assets/icons/dark/mekanismi-icon.svg"
    >
    <h1>{{ $t('wiki.changesCard.title') }}</h1>
    <ul>
      <li
        v-for="item in recent"
        :key="item.changetime"
      >
        <span class="siteslug">{{ item.siteid }}</span>
        <router-link :to="`/mekanismi/view/${item.siteid}/${item.pageid}`">
          {{ item.name }}
        </router-link>
      </li>
    </ul>
    <div
      class="toolbar"
      style="margin-bottom: -8px"
    >
      <div class="spacer" />
      <Action
        v-if="isAnonymous"
        to="/wiki/changes"
        dark
        mobile
      >
        ...See more
      </Action>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuthState } from '@/state/authz'
import { usePagelog } from '@/state/pagelog'
import { defineComponent } from 'vue'
import Action from '../material/Action.vue'
/**
 * A simple welcome card for anonymous visitors
 */
export default defineComponent({
  name: 'WikiChangesCard',
  components: { Action },
  setup () {
    const { isAnonymous } = useAuthState()
    const { recent } = usePagelog()
    return { isAnonymous, recent }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.wikiChangesCard
  display: block
  background-color: $color-fill-tertiary
  margin-bottom: 8px
  padding: 16px
  border-radius: 8px
  position: relative
  min-height: 72px
  img.logo
    position: absolute
    top: 16px
    left: 8px
    height: 72px
    width: 72px
  h1
    @include TypeHeadline5()
    margin-left: 72px
    color: $color-dark-font-high
  ul
    margin-left: 0
    padding-left: 18px
  p, li
    @include TypeBody2()
    margin-left: 72px
    color: $color-dark-font-medium
    a
      color: $color-dark-font-medium
    .siteslug
      color: $color-dark-font-disabled
      padding-right: 8px

</style>
