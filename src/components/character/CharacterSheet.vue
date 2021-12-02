<template>
  <div class="CharacterSheet">
    <template
      v-for="k in Object.keys(layout)"
      :key="k"
    >
      <template v-if="typeof layout[k] === 'string'">
        <CharacterStat
          :character="character"
          :stat="k"
        />
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { useAuth } from '@/state/authz'
import { useCharacters } from '@/state/characters'
import { Character } from '@/state/characters/Character'
import { logDebug } from '@/utils/eventLogger'
import { computed, ComputedRef, defineComponent } from 'vue'
import CharacterStat from './CharacterStat.vue'
import defautsheet from '@/layouts/default.layout.json'
import ddsheet from '@/layouts/dd5.layout.json'

interface ThirdLevelNode {
  [key: string]: string | Array<string>
}

interface SecondLevelNode {
  [key: string]: string | Array<string> | ThirdLevelNode
}

interface LayoutNode {
  [key: string]: string | SecondLevelNode | Array<string | SecondLevelNode>
}

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
    const layout:ComputedRef<LayoutNode> = computed(() => {
      if (character.value.characterSheetType === 'dd') {
        return ddsheet
      }
      return defautsheet
    })
    return { character, profileData, layout }
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
