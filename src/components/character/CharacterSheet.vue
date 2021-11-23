<template>
  <div>
    <div
      v-for="block, index in character.sheet.layout"
      :key="index"
    >
      <span
        v-for="item, lineindex in block"
        :key="lineindex"
      >
        <template v-if="character.stats.has(item)">
          {{ character.getStatLabel(item, profileData.languageCode) }} {{ character.getStat(item) }}
        </template>
        <template v-else>
          [ {{ character.deriveStat(item) }} ]
        </template>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuth } from '@/state/authz'
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
    const { profileData } = useAuth()
    const character = computed(() => {
      logDebug('getting', props.id)
      const c = characters.value.get(props.id) || new Character('-')
      c.applyCharacterSheet(ddCharacterSheet)
      return c
    })
    return { character, profileData }
  }
})
</script>
