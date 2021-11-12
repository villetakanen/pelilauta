<template>
  <div class="characterSheetView">
    <SiteToolbar />
    <div class="singleColumnLayout">
      <Loader v-if="!character" />
      <CharacterSheet :character="character" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useSite } from '@/state/site'
import Loader from '@/components/app/Loader.vue'
import SiteToolbar from '@/components/site/SiteToolbar.vue'
import { useCharacters, toPlayerCharacter } from '@/state/characters'
import CharacterSheet from '@/components/site/characters/CharacterSheet.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    Loader,
    SiteToolbar,
    CharacterSheet
  },
  props: {
    siteid: {
      type: String,
      required: true
    },
    characterid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { site } = useSite(props.siteid)
    const { characters } = useCharacters()
    const character = ref(toPlayerCharacter())

    onMounted(() => {
      watch(() => props.characterid, (characterid) => {
        character.value = characters.value.get(characterid) ?? toPlayerCharacter()
      }, { immediate: true })
    })

    return { character, site }
  }
})
</script>
