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
        <EditableColumn
          class="flex-span-2"
          style="border-bottom: solid 1px var(--color-b-h)"
        >
          <template #viewer>
            <div :innerHTML="character.htmlContent" />
          </template>
          <template #editor>
            <RichTextEditor />
          </template>
        </EditableColumn>
        <div class="debug flex-span-2">
          {{ character }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue'
import { useCharacters } from '@/state/characters'
import RichTextEditor from '@/components/quill/RichTextEditor.vue'
import { useSite } from '@/state/site'
import { PlayerCharacter } from '@/utils/firestoreInterfaces'
import CharacterMetaForm from '@/components/character/CharacterMetaForm.vue'
import EditableColumn from '@/components/layout/EditableColumn.vue'

export default defineComponent({
  name: 'CharacterView',
  components: { RichTextEditor, CharacterMetaForm, EditableColumn },
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
      watch(character, (c) => {
        console.log('c', c)
        if (!c) return
        const char = c as PlayerCharacter
        if (char.siteid) {
          useSite(char.siteid)
        }
      },
      { immediate: true })
    })

    return { character }
  }
})
</script>
