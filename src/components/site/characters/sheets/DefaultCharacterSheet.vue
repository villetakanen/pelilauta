<template>
  <div class="defaultCharacterSheet characterSheet">
    <h1>Default Character Sheet</h1>
    <div>
      <h2>{{ $t('site.characters.fields.name') }}</h2>
      <Textfield v-model="name" />
      <h2>{{ $t('site.characters.fields.description') }}</h2>
      <textarea
        v-model="description"
        class="characterSheetField descriptionField"
      />
    </div>
    {{ character }}
  </div>
</template>

<script lang="ts">
import Textfield from '@/components/form/Textfield.vue'
import { PlayerCharacter } from '@/utils/firestoreInterfaces'
import { defineComponent, PropType, ref, watch } from 'vue'
import { logError } from '@/utils/eventLogger'

export default defineComponent({
  components: { Textfield },
  props: {
    character: {
      type: Object as PropType<PlayerCharacter>,
      required: true
    }
  },
  setup (props) {
    const name = ref('')
    const description = ref('')
    watch(() => props.character, (c) => {
      name.value = c.name
      // description.value = c.description
    }, {
      immediate: true
    })
    async function pushChanges () {
      const char = { ...props.character }
      char.name = name.value
      // char.description = description.value
      return logError('not implemented') // updatePlayerCharacter(char)
    }
    return { description, pushChanges, name }
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
