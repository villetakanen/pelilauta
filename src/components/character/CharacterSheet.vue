<template>
  <div class="CharacterSheet">
    <div
      v-for="(block, blockIndex) in character.sheet.layout"
      :key="blockIndex"
    >
      <div
        v-for="(row, rowIndex) in block"
        :key="rowIndex"
      >
        <template
          v-for="stat in row"
          :key="stat"
        >
          <CharacterStat
            :character="character"
            :stat="stat"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuth } from '@/state/authz'
import { useCharacters } from '@/state/characters'
import { Character } from '@/state/characters/Character'
import { logDebug } from '@/utils/eventLogger'
import { computed, defineComponent } from 'vue'
import CharacterStat from './CharacterStat.vue'

export default defineComponent({
  name: 'CharacterSheet',
  components: { CharacterStat },
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
      return c
    })
    return { character, profileData }
  }
})
</script>

<style lang="sass" scoped>
.statLabel
  font-weight: bold
.statValue
  display: inline-block
  padding: 4px
  border-radius: 4px
  border: solid 1px var(--chroma-secondary-g)
</style>
