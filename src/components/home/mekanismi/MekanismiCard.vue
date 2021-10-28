<template>
  <Card
    id="MekanismiCard"
    class="chroma-box-1 rise-1"
  >
    <h1>{{ $t('home.changesCard.title') }}</h1>
    <WikiChangesItem
      v-for="site in topThreeSites"
      :key="site.name"
      :name="site.name"
      pageid="-"
      :badge="site.systemBadge"
      :change="toDisplayString(site.lastUpdate)"
      :siteid="site.id"
    />
  </Card>
</template>

<script lang="ts">
import Card from '@/components/layout/Card.vue'
import { useSites, sortByLastUpdate } from '@/state/sites'
import { toDisplayString } from '@/utils/firebaseTools'
import { defineComponent, computed } from 'vue'
import WikiChangesItem from '../WikiChangesItem.vue'

/**
 * A Mekanismi / Sites chanfes card
 */
export default defineComponent({
  name: 'MekanismiCard',
  components: { Card, WikiChangesItem },
  setup () {
    const { visibleSites } = useSites()
    const topThreeSites = computed(() => {
      const arr = visibleSites.value.slice().sort((a, b) => (sortByLastUpdate(a, b)))
      if (arr.length > 3) arr.length = 3
      return arr
    })
    return { topThreeSites, toDisplayString }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

#MekanismiCard
  position: relative
  min-height: 72px
  h1
    @include TypeCardHeadline()
    color: var(--chroma-secondary-h)

</style>
