<template>
  <div class="playerRowItem">
    <router-link :to="`/u/${player.uid}`">
      {{ player.nick }}
    </router-link>
    <MaterialButton text>
      {{ $t('site.players.dropThePlayer') }}
    </MaterialButton>
  </div>
</template>

<script lang="ts">
import MaterialButton from '@/components/material/MaterialButton.vue'
import { Player } from '@/utils/uiInterfaces'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'PlayerRowItem',
  components: { MaterialButton },
  props: {
    player: {
      type: Object as PropType<Player>,
      required: true
    }
  },
  setup () {
  }
})
</script>
