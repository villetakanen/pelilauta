<template>
  <Column class="CharacterMetaForm">
    <Textfield
      v-model="name"
      :label="$t('character.meta.name')"
    />
    <AvatarSelector v-model="avatarURL" />
    <CharacterSiteSelect v-model="site" />
  </Column>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Character, useCharacters } from '@/state/characters'
import Column from '../layout/Column.vue'
import Textfield from '../form/Textfield.vue'
import AvatarSelector from '../avatar/AvatarSelector.vue'
import CharacterSiteSelect from './CharacterSiteSelect.vue'

export default defineComponent({
  name: 'CharacterMetaForm',
  components: { Column, Textfield, AvatarSelector, CharacterSiteSelect },
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

    const site = computed({
      get: () => {
        return character.value.site
      },
      set: (value) => {
        character.value.site = value
      }
    })

    return { character, name, avatarURL, site }
  }
})
</script>
