<template>
  <div class="CharacterListRow">
    <AuthorTag
      v-if="character.player"
      :uid="character.player"
    />
    {{ characterid }} |
    {{ character.player }} |
    {{ character.name }} |
    {{ character.id }}
  </div>
</template>

<script lang="ts">
import { Character } from '@/state/characters/Character'
import { useSiteCharacters } from '@/state/site'
import { computed, defineComponent } from 'vue'
import AuthorTag from '../author/AuthorTag.vue'

export default defineComponent({
  components: { AuthorTag },
  props: {
    characterid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { characters } = useSiteCharacters()
    const character = computed(() => characters.value.get(props.characterid) || new Character())
    return { character }
  }
})
</script>
