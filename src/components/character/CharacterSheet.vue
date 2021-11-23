<template>
  <div>
    <div
      v-for="block, index in character.sheet.layout"
      :key="index"
    >
      <div
        v-for="item, lineindex in block"
        :key="lineindex"
      >
        {{ character.getStat(item) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useCharacters } from '@/state/characters'
import { Character } from '@/state/characters/Character'
import { logDebug } from '@/utils/eventLogger'
import { computed, defineComponent } from 'vue'
import ddCharacterSheet from './ddCharSheet.json'

export default defineComponent({
  name: 'CharacterSheet',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { characters } = useCharacters()
    const character = computed(() => {
      logDebug('getting', props.id)
      const c = characters.value.get(props.id) || new Character('-')
      c.applyCharacterSheet(ddCharacterSheet)
      return c
    })
    return { character }
  }
})
</script>
