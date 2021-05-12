<template>
  <div class="">
    <h1 class="title">
      {{ $t('site.players.title') }}
    </h1>
    <p class="tooltip">
      {{ $t('site.settings.access.playerTooltip') }}
    </p>
    <div class="playerChips">
      <Chip
        v-for="p in players"
        :key="p.uid"
        :label="p.nick"
      />
      <p v-if="!players || players.length < 1">
        {{ $t('site.settings.access.noPlayers') }}
      </p>
    </div>
    <p style="text-align: right">
      <router-link :to="`/site/players/${site.id}`">
        {{ $t('site.players.title') }}
      </router-link>
    </p>
  </div>
</template>

<script lang="ts">
import Chip from '@/components/material/Chip.vue'
import { useAuthors } from '@/state/authors'
import { Site } from '@/state/site'
import { Player } from '@/utils/uiInterfaces'
import { computed, ComputedRef, defineComponent, PropType } from 'vue'

export default defineComponent({
  components: { Chip },
  props: {
    site: {
      type: Object as PropType<Site>,
      required: false,
      default: 1
    }
  },
  setup (props) {
    const { authors } = useAuthors()
    const players:ComputedRef<Array<Player>> = computed(() => (
      props.site.players?.map((uid) => (
        {
          uid: uid,
          nick: authors.value.find((a) => (a.uid === uid))?.nick || 'anonymous'
        }
      )) || new Array<Player>()))
    return { players }
  }
})
</script>
