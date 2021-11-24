<template>
  <div class="characterListingView bookLayout">
    <CharacterSheet
      :id="id"
      class="double"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch } from 'vue'
import { useCharacters } from '@/state/characters'
import { useSite } from '@/state/site'
import { Character } from '@/state/characters/Character'
import CharacterSheet from '@/components/character/CharacterSheet.vue'

export default defineComponent({
  name: 'CharacterView',
  components: { CharacterSheet },
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
