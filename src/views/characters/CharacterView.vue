<template>
  <div class="characterListingView">
    <h1
      class="title"
      style="padding: 0 8px"
    >
      {{ character.name }}
    </h1>
    <div class="singleColumnLayout">
      <div class="debug">
        {{ character }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue'
import { useCharacters } from '@/state/characters'

export default defineComponent({
  name: 'CharacterView',
  props: {
    id: {
      type: String,
      required: false,
      default: '-'
    }
  },
  setup (props) {
    const { fetchPlayerCharacter, character } = useCharacters()

    onMounted(() => {
      watch(() => props.id, (id) => {
        fetchPlayerCharacter(id)
      }, { immediate: true })
    })

    return { character }
  }
})
</script>
