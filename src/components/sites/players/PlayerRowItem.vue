<template>
  <router-link :to="`/u/${player.uid}`">
    {{ player.nick }}
  </router-link>
  <p>[ select a character ]</p>
  <MaterialButton
    text
    :async-action="dropPlayer"
  >
    {{ $t('site.players.dropThePlayer') }}
  </MaterialButton>
</template>

<script lang="ts">
import MaterialButton from '@/components/material/MaterialButton.vue'
import { useSnack } from '@/composables/useSnack'
import { useSite } from '@/state/site'
import { Player } from '@/utils/uiInterfaces'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'PlayerRowItem',
  components: { MaterialButton },
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
