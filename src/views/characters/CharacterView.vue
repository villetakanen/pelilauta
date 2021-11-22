<template>
  <div class="characterListingView">
    <div v-if="character">
      <h1
        class="title"
        style="padding: 0 8px"
      >
        {{ character.name }}
      </h1>
      <div class="flexLayout">
        <CharacterMetaForm
          class="flex-span-1"
          style="border-bottom: solid 1px var(--color-b-h)"
        />
        <CharacterDescriptionCol
          class="flex-span-2"
          style="border-bottom: solid 1px var(--color-b-h)"
        />
        <div class="debug flex-span-2">
          {{ character }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch } from 'vue'
import { useCharacters } from '@/state/characters'
import { useSite } from '@/state/site'
import CharacterMetaForm from '@/components/character/CharacterMetaForm.vue'
import CharacterDescriptionCol from '@/components/character/CharacterDescriptionCol.vue'
import { Character } from '@/state/characters/Character'

export default defineComponent({
  name: 'CharacterView',
  components: { CharacterMetaForm, CharacterDescriptionCol },
  props: {
    id: {
      type: String,
      required: false,
      default: '-'
    }
  },
  setup (props) {
    const { characters } = useCharacters()
    const character = computed(() => {
      return characters.value.get(props.id) || new Character('...')
    })

    onMounted(() => {
      watch(character, (char) => {
        if (char.site) {
          useSite(char.site)
        }
      },
      { immediate: true })
    })

    return { character }
  }
})
</script>
