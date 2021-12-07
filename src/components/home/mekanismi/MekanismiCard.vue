<template>
  <Card
    id="MekanismiCard"
    class="chroma-box-1 rise-1"
  >
    <h1>{{ $t('home.changesCard.title') }}</h1>
    <WikiChangesItem
      v-for="site in topThreeSites"
      :key="site.id"
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
import { useSites } from '@/state/sites'
import { defineComponent, computed } from 'vue'
import WikiChangesItem from '../WikiChangesItem.vue'

/**
 * A Mekanismi / Sites chanfes card
 */
export default defineComponent({
  name: 'MekanismiCard',
  components: { Card, WikiChangesItem, Toolbar, SpacerDiv, Button },
  setup () {
    const { publicSites, userSites } = useSites()
    const { reroute } = useUxActions()

    const topThreeSites = computed(() => {
      const allSites = [...publicSites.value, ...userSites.value].sort(
        (a, b) => b.compareChangeTime(a)
      )
      return allSites.slice(0, 3)
    })

    return { topThreeSites, reroute }
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
