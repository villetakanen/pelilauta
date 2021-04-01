<template>
  <div class="wikiChangesCard">
    <img
      class="logo"
      :alt="$t('wiki.title')"
      src="@/assets/icons/dark/mekanismi.svg"
    >
    <h1>{{ $t('home.changesCard.title') }}</h1>
    <WikiChangesItem
      v-for="item in recent"
      :key="item.changetime"
      style="margin-left: 76px"
      :name="item.name"
      :pageid="item.pageid"
      :change="toDisplayString(item.changetime)"
      :siteid="item.siteid"
    />
    <div
      class="toolbar"
      style="margin-bottom: -8px; margin-top: -16px"
    >
      <div class="spacer" />
      <Action
        to="/wiki/changes"
        dark
        mobile
      >
        {{ $t('home.changesCard.seeMore') }}
      </Action>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuthState } from '@/state/authz'
import { usePagelog } from '@/state/pagelog'
import { defineComponent } from 'vue'
import { toDisplayString } from '@/utils/firebaseTools'
import Action from '../material/Action.vue'
import WikiChangesItem from './WikiChangesItem.vue'
/**
 * A simple welcome card for anonymous visitors
 */
export default defineComponent({
  name: 'WikiChangesCard',
  components: { Action, WikiChangesItem },
  setup () {
    const { isAnonymous } = useAuthState()
    const { recent } = usePagelog()
    return { isAnonymous, recent, toDisplayString }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.wikiChangesCard
  display: block
  background: linear-gradient(-44deg, var(--chroma-secondary-a) 0%, var(--chroma-secondary-c) 100%)
  margin-bottom: 8px
  padding: 16px
  border-radius: 8px
  position: relative
  min-height: 72px
  img.logo
    position: absolute
    top: 8px
    left: 8px
    height: 72px
    width: 72px
  h1
    @include TypeCardHeadline()
    margin-left:76px
    color: var(--chroma-secondary-i)
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
