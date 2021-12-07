<template>
  <Card class="sitePlayersList contentArea contentBox">
    <h1 class="title">
      {{ $t('site.players.title') }}
    </h1>
    <div class="playerTable">
      <h4>{{ $t('site.players.author') }}</h4>
      <h4>{{ $t('site.players.character') }}</h4>
      <h4>{{ $t('site.players.actions') }}</h4>
      <PlayerRowItem
        v-for="player in playerList"
        :key="player.uid"
        :player="player"
      />
    </div>
    <p class="tooltip">
      {{ $t('site.settings.access.playerTooltip') }}
    </p>
    <p>
      <MaterialSelect
        v-model="newPlayerUid"
        :opts="availablePlayers"
      /><MaterialButton :async-action="addToGame">
        {{ $t('site.players.addAsNew') }}
      </MaterialButton>
    </p>
  </Card>
</template>

<script lang="ts">
import { useAuthors } from '@/state/authors'
import { Site, useSite } from '@/state/site'
import { Player } from '@/utils/uiInterfaces'
import { computed, ComputedRef, defineComponent, PropType, ref } from 'vue'
import Card from '../../layout/Card.vue'
import MaterialButton from '../../material/MaterialButton.vue'
import MaterialSelect from '../../material/MaterialSelect.vue'
import PlayerRowItem from './PlayerRowItem.vue'

export default defineComponent({
  name: 'SitePlayersList',
  components: { Card, MaterialSelect, MaterialButton, PlayerRowItem },
  props: {
    site: {
      type: Object as PropType<Site>,
      required: true
    }
  },
  setup (props) {
    const { authors } = useAuthors()
    const { addPlayer } = useSite()
    const playerList:ComputedRef<Array<Player>> = computed(() => (
      props.site.players?.map((uid) => (
        {
          uid: uid,
          nick: authors.value.find((a) => (a.uid === uid))?.nick || 'anonymous'
        }
      )) || new Array<Player>()))
    // const availablePlayers = computed(() => (authors.value.filter((a) => (!playerList.value?.find((p) => (p.uid !== a.uid))))).map((a) => ({
    const availablePlayers = computed(() => (
      authors.value.filter((af) => (!playerList.value?.find((p) => (p.uid === af.uid))))
        .map((a) => (
          {
            value: a.nick,
            key: a.uid
          }
        ))
    ))
    const newPlayerUid = ref('')
    const addToGame = async () => {
      return addPlayer(newPlayerUid.value)
    }
    return { playerList, availablePlayers, newPlayerUid, addToGame }
  }
})
</script>

<style lang="sass" scoped>
.playerTable
  display: grid
  grid-template-columns: 1fr 1fr 1fr
</style>
