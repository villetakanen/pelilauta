<template>
  <div
    class="characterSheet"
  >
    <LLCharacterSheet
      v-if="character.type === 'll'"
      :character="character"
    />
    <DefaultCharacterSheet
      v-else
      :character="character"
    />
  </div>
</template>

<script lang="ts">
import { PlayerCharacter } from '@/utils/firestoreInterfaces'
import { defineComponent, PropType } from 'vue'
import DefaultCharacterSheet from './sheets/DefaultCharacterSheet.vue'
import LLCharacterSheet from './sheets/LLCharacterSheet.vue'

export default defineComponent({
  components: { DefaultCharacterSheet, LLCharacterSheet },
  props: {
    character: {
      type: Object as PropType<PlayerCharacter>,
      required: true
    }
  }
})
</script>

<style lang="sass" scoped>

</style>
