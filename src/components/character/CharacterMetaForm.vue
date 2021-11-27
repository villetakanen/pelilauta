<template>
  <Column class="CharacterMetaForm">
    <Textfield
      v-model="name"
      :label="$t('character.meta.name')"
    />
    <AvatarSelector v-model="avatarURL" />
  </Column>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Character, useCharacters } from '@/state/characters'
import Column from '../layout/Column.vue'
import Textfield from '../form/Textfield.vue'
import AvatarSelector from '../avatar/AvatarSelector.vue'

export default defineComponent({
  name: 'CharacterMetaForm',
  components: { Column, Textfield, AvatarSelector },
  props: {
    characterId: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { characters } = useCharacters()
    const character = computed(() => (characters.value.get(props.characterId) || new Character()))

    const name = computed({
      get: () => {
        return character.value.name
      },
      set: (value) => {
        character.value.name = value
      }
    })

    const avatarURL = computed({
      get: () => {
        return character.value.avatarURL
      },
      set: (value) => {
        character.value.avatarURL = value
      }
    })

    return { character, name, avatarURL }
  }
})
</script>
