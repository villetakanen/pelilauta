<template>
  <div
    class="characterSheet"
  >
    <DefaultCharacterSheet
      :character="character"
    />
  </div>
</template>

<script lang="ts">
import { PlayerCharacter } from '@/utils/firestoreInterfaces'
import { defineComponent, PropType } from 'vue'
import DefaultCharacterSheet from './sheets/DefaultCharacterSheet.vue'

export default defineComponent({
  components: { DefaultCharacterSheet },
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
