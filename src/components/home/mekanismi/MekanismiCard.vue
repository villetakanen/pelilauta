<template>
  <Card
    id="MekanismiCard"
    class="chroma-box-1 rise-1"
  >
    <h1>{{ $t('home.changesCard.title') }}</h1>
    <WikiChangesItem
      v-for="site in topThreeSites"
      :key="site.name"
      :name="site.latestPages ? site.latestPages[0].name : site.name"
      :pageid="site.latestPages ? site.latestPages[0].id : '-'"
      :badge="site.systemBadge"
      :change="toDisplayString(site.lastUpdate)"
      :siteid="site.id"
    />
    <Toolbar style="margin-bottom: -8px; margin-top: -8px; margin-right: -8px">
      <SpacerDiv />
      <Button
        dark
        text
        @click="reroute('/mekanismi')"
      >
        {{ $t('home.changesCard.seeMore') }}
      </Button>
    </Toolbar>
  </Card>
</template>

<script lang="ts">
import Button from '@/components/form/Button.vue'
import Card from '@/components/layout/Card.vue'
import SpacerDiv from '@/components/layout/SpacerDiv.vue'
import Toolbar from '@/components/layout/Toolbar.vue'
import { useUxActions } from '@/composables/useUxActions'
import { useSites, sortByLastUpdate } from '@/state/sites'
import { toDisplayString } from '@/utils/firebaseTools'
import { defineComponent, computed } from 'vue'
import WikiChangesItem from '../WikiChangesItem.vue'

/**
 * A Mekanismi / Sites chanfes card
 */
export default defineComponent({
  name: 'MekanismiCard',
  components: { Card, WikiChangesItem, Toolbar, SpacerDiv, Button },
  setup () {
    const { visibleSites } = useSites()
    const { reroute } = useUxActions()

    const topThreeSites = computed(() => {
      const arr = visibleSites.value.slice().sort((a, b) => (sortByLastUpdate(a, b)))
      if (arr.length > 3) arr.length = 3
      return arr
    })
    return { topThreeSites, toDisplayString, reroute }
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
