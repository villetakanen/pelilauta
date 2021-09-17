<template>
  <Card
    class="wikiChangesCard"
    :rise="1"
  >
    <img
      class="logo"
      :alt="$t('wiki.title')"
      src="@/assets/icons/dark/mekanismi.svg"
    >
    <h1>{{ $t('home.changesCard.title') }}</h1>
    <WikiChangesItem
      v-for="item in pageLog"
      :key="item.changetime"
      :name="item.name"
      :pageid="item.pageid"
      :badge="item.badge"
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
  </Card>
</template>

<script lang="ts">
import { usePagelog } from '@/state/pagelog'
import { computed, defineComponent } from 'vue'
import { toDisplayString } from '@/utils/firebaseTools'
import Action from '../material/Action.vue'
import WikiChangesItem from './WikiChangesItem.vue'
import Card from '../layout/Card.vue'
import { useSites } from '@/state/sites'
/**
 * A simple welcome card for anonymous visitors
 */
export default defineComponent({
  name: 'WikiChangesCard',
  components: { Action, WikiChangesItem, Card },
  setup () {
    const { recent } = usePagelog()
    const { allSites } = useSites()
    const pageLog = computed(() => (recent.value.map((r) => (
      {
        ...r,
        badge: allSites.value.find((s) => (s.id === r.siteid))?.systemBadge ?? 'mekanismi'
      }
    ))))
    return { pageLog, toDisplayString }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.wikiChangesCard
  display: block
  background: linear-gradient(-44deg, var(--color-a-a) 0%, var(--color-b-d) 100%)
  position: relative
  min-height: 72px
  img.logo
    position: absolute
    top: -22px
    right: -98px
    height: 280px
    width: 280px
    opacity: 0.11
    pointer-events: none
  h1
    @include TypeCardHeadline()
    // margin-left:76px
    color: var(--chroma-secondary-i)
  ul
    margin-left: 0
    padding-left: 18px
  p, li
    @include TypeBody2()
    // margin-left: 72px
    color: $color-dark-font-medium
    a
      color: $color-dark-font-medium
    .siteslug
      color: $color-dark-font-disabled
      padding-right: 8px

</style>
