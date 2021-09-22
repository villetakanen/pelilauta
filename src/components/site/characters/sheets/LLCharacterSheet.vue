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
      <LLPrimaryStatField
        name="str"
        label="Voimakkuus"
      />
      <LLPrimaryStatField
        name="sta"
        label="Sitkeys"
      />
      <LLPrimaryStatField
        name="dex"
        label="Ketteryys"
      />
      <LLPrimaryStatField
        name="int"
        label="Älykkyys"
      />
      <LLPrimaryStatField
        name="wis"
        label="Neuvokkuus"
      />
      <LLPrimaryStatField
        name="cha"
        label="Karisma"
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
import LLPrimaryStatField from './LLPrimaryStatField.vue'

export default defineComponent({
  components: { TextField, MaterialButton, LLPrimaryStatField },
  props: {
    character: {
      type: Object as PropType<PlayerCharacter>,
      required: true
    }
  },
  setup (props) {
    const name = ref('')
    const description = ref('')
    const stats = ref(new Map<string, string|number|boolean>())
    watch(() => props.character, (c) => {
      name.value = c.name
      // description.value = c.description

      // get all DD stats here
      // if (c.stats) stats.value = c.stats
    }, {
      immediate: true
    })
    const { updatePlayerCharacter } = useCharacters()
    async function pushChanges () {
      const char = { ...props.character }
      char.name = name.value
      // char.description = description.value
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
