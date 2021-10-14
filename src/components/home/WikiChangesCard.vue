<template>
  <Card
    class="wikiChangesCard chroma-box-1"
    :rise="1"
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
      style="margin-bottom: -8px; margin-top: -8px; margin-right: -8px"
    >
      <div class="spacer" />
      <Button
        dark
        text
        @click="reroute('/mekanismi')"
      >
        {{ $t('home.changesCard.seeMore') }}
      </Button>
    </div>
  </Card>
</template>

<script lang="ts">
import { usePagelog } from '@/state/pagelog'
import { computed, defineComponent } from 'vue'
import { toDisplayString } from '@/utils/firebaseTools'
import WikiChangesItem from './WikiChangesItem.vue'
import Card from '../layout/Card.vue'
import { useSites } from '@/state/sites'
import Button from '../form/Button.vue'
import { useUxActions } from '@/composables/useUxActions'
/**
 * A simple welcome card for anonymous visitors
 */
export default defineComponent({
  name: 'WikiChangesCard',
  components: { WikiChangesItem, Card, Button },
  setup () {
    const { recent } = usePagelog()
    const { allSites } = useSites()
    const { reroute } = useUxActions()
    const pageLog = computed(() => (recent.value.map((r) => (
      {
        ...r,
        badge: allSites.value.find((s) => (s.id === r.siteid))?.systemBadge ?? 'mekanismi'
      }
    ))))
    return { pageLog, toDisplayString, reroute }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

.wikiChangesCard
  display: block
  position: relative
  min-height: 72px
  h1
    @include TypeCardHeadline()
    color: var(--chroma-secondary-h)

</style>
