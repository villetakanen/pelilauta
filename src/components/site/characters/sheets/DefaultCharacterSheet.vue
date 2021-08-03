<template>
  <div class="defaultCharacterSheet characterSheet">
    <h1>Default Character Sheet</h1>
    {{ character }}
    <div>
      <h2>{{ $t('site.characters.fields.name') }}</h2>
      <TextField v-model="name" />
      <h2>{{ $t('site.characters.fields.description') }}</h2>
      <textarea
        v-model="description"
        class="characterSheetField descriptionField"
      />
    </div>
    <div class="toolbar">
      <div class="spacer" />
      <MaterialButton>{{ $t('action.save') }}</MaterialButton>
    </div>
  </div>
</template>

<script lang="ts">
import MaterialButton from '@/components/material/MaterialButton.vue'
import TextField from '@/components/material/TextField.vue'
import { PlayerCharacter } from '@/utils/firestoreInterfaces'
import { defineComponent, PropType, ref } from 'vue'

export default defineComponent({
  components: { TextField, MaterialButton },
  props: {
    character: {
      type: Object as PropType<PlayerCharacter>,
      required: true
    }
  },
  setup (props) {
    const description = ref(props.character.description)
    return { description }
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
