<template>
  <div class="AddCharacterView">
    <Header>
      <ViewTitle icon="add">
        {{ $t('character.add.title') }}
      </ViewTitle>
    </Header>
    <main class="singleColumnLayout">
      <Textfield
        v-model="name"
        :label="$t('character.meta.name')"
      />
      <Select
        v-model="system"
        name="systemSelector"
        :label="$t('character.meta.system')"
        :opts="opts"
      />
      <Toolbar>
        <SpacerDiv />
        <Button
          text
          @click="reroute('/characters')"
        >
          {{ $t('action.cancel') }}
        </Button>
        <Button
          :disabled="!name"
          @click="addCharacter"
        >
          {{ $t('action.add') }}
        </Button>
      </Toolbar>
    </main>
  </div>
</template>

<script lang="ts">
import Textfield from '@/components/form/Textfield.vue'
import Header from '@/components/layout/Header.vue'
import ViewTitle from '@/components/layout/ViewTitle.vue'
import Select from '@/components/form/Select.vue'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Toolbar from '@/components/layout/Toolbar.vue'
import SpacerDiv from '@/components/layout/SpacerDiv.vue'
import Button from '@/components/form/Button.vue'
import { useUxActions } from '@/composables/useUxActions'
import { useCharacters, Character } from '@/state/characters'

export default defineComponent({
  components: { ViewTitle, Header, Textfield, Select, Button, Toolbar, SpacerDiv },
  setup () {
    const i18n = useI18n()
    const { reroute } = useUxActions()
    const { createCharacter } = useCharacters()
    const name = ref('')
    const system = ref('-')
    const opts = new Map<string, string>(
      [
        ['-', i18n.t('character.sheet.plain')],
        ['dd', i18n.t('character.sheet.dnd')],
        ['quick', i18n.t('character.sheet.quick')]
      ])

    const addCharacter = async () => {
      const character = new Character()
      character.name = name.value
      character.characterSheetType = system.value
      const id = await createCharacter(character)
      reroute('/character/' + id)
    }

    return {
      opts,
      system,
      reroute,
      addCharacter,
      name
    }
  }
})
</script>
