<template>
  <div class="llCharacterSheet characterSheet">
    <h1 class="gametitle">
      Legendoja ja Lohikäärmeitä
    </h1>
    <div class="blockRow">
      <h2>{{ $t('site.characters.fields.name') }}</h2>
      <TextField v-model="name" />
      <h2>{{ $t('site.characters.fields.description') }}</h2>
      <textarea
        v-model="description"
        class="characterSheetField descriptionField"
      />
    </div>
    <div class="blockRow">
      <CharsheetField
        v-model="stats.strength"
        name="strength"
        label="Voima"
      />
    </div>
    <div class="toolbar">
      <div class="spacer" />
      <MaterialButton :async-action="pushChanges">
        {{ $t('action.save') }}
      </MaterialButton>
    </div>
  </div>
</template>

<script lang="ts">
import MaterialButton from '@/components/material/MaterialButton.vue'
import TextField from '@/components/material/TextField.vue'
import { useCharacters } from '@/state/characters'
import { PlayerCharacter } from '@/utils/firestoreInterfaces'
import { defineComponent, PropType, ref, watch } from 'vue'
import CharsheetField from './CharsheetField.vue'

const llStatBlocks = {
  strength: 10,
  dexterity: 10,
  constitution: 10,
  wisdom: 10,
  intelligence: 10,
  charisma: 10
}

export default defineComponent({
  components: { TextField, MaterialButton, CharsheetField },
  props: {
    character: {
      type: Object as PropType<PlayerCharacter>,
      required: true
    }
  },
  setup (props) {
    const name = ref('')
    const description = ref('')
    const stats = ref({ ...llStatBlocks })
    watch(() => props.character, (c) => {
      name.value = c.name
      description.value = c.description
    }, {
      immediate: true
    })
    const { updatePlayerCharacter } = useCharacters()
    async function pushChanges () {
      const char = { ...props.character }
      char.name = name.value
      char.description = description.value
      return updatePlayerCharacter(char)
    }
    return { description, pushChanges, name, stats }
  }
})
</script>

<style lang="sass" scoped>
.characterSheetField
  background-color: var(--chroma-secondary-h)
  display: block
  box-sizing: border-box
  padding: 8px
  width: 100%
  border: 0
  border-bottom: solid 1px var(--chroma-secondary-c)

.descriptionField
  height: calc(24 * 7px)

</style>
