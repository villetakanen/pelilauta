<template>
  <router-link :to="`/u/${player.uid}`">
    {{ player.nick }}
  </router-link>
  <p>[ select a character ]</p>
  <Button
    text
    @click="dropPlayer()"
  >
    {{ $t('site.players.dropThePlayer') }}
  </Button>
</template>

<script lang="ts">
import Button from '@/components/form/Button.vue'
import { useSnack } from '@/composables/useSnack'
import { useSite } from '@/state/site'
import { Player } from '@/utils/uiInterfaces'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'PlayerRowItem',
  components: { Button },
  props: {
    player: {
      type: Object as PropType<Player>,
      required: true
    }
  },
  setup (props) {
    const { removePlayer } = useSite()
    const { pushSnack } = useSnack()
    const i18n = useI18n()
    const dropPlayer = async () => {
      await removePlayer(props.player.uid)
      pushSnack(i18n.t('site.players.removed'))
    }
    return { dropPlayer }
  }
})
</script>
