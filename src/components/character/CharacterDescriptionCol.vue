<template>
  <EditableColumn
    v-model="toggle"
    class="CharacterDescriptionCol"
  >
    <template #viewer>
      <div :innerHTML="description" />
    </template>
    <template #editor>
      <MaterialButton
        text
        :async-action="save"
      >
        {{ $t('action.save') }}
      </MaterialButton>
      <RichTextEditor v-model:content="description" />
    </template>
  </EditableColumn>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useCharacters } from '@/state/characters'
import EditableColumn from '../layout/EditableColumn.vue'
import RichTextEditor from '../quill/RichTextEditor.vue'
import MaterialButton from '../material/MaterialButton.vue'
import { logError } from '@/utils/eventLogger'
import { Character } from '@/state/characters/Character'

export default defineComponent({
  name: 'CharacterMetaForm',
  components: { EditableColumn, RichTextEditor, MaterialButton },
  props: {
    characterid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { characters } = useCharacters()
    const character = computed(() => characters.value.get(props.characterid)) || new Character('...')
    const updatedContent = ref('')
    const toggle = ref(false)

    const description = computed({
      get: () => (updatedContent.value ? updatedContent.value : character?.value?.htmlDescription || ''),
      set: (n: string) => {
        updatedContent.value = n
      }
    })

    onMounted(() => {
      watch(toggle, (t) => {
        if (t && updatedContent) {
          save()
        }
      })
    })

    async function save () {
      logError('not implemented')
      // updatePlayerCharacterFields(characterid.value, { htmlContent: updatedContent.value })
    }

    return { description, toggle, save }
  }
})
</script>
