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
      <div style="display:flex; gap: 12px">
        <Select
          v-model="system"
          style="flex-grow: 1"
          name="systemSelector"
          :label="$t('character.meta.system')"
          :opts="opts"
        />
        <Select
          v-model="site"
          name="siteSelector"
          :label="$t('character.meta.site')"
          :opts="siteOpts"
        />
      </div>
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
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Toolbar from '@/components/layout/Toolbar.vue'
import SpacerDiv from '@/components/layout/SpacerDiv.vue'
import Button from '@/components/form/Button.vue'
import { useUxActions } from '@/composables/useUxActions'
import { useCharacters, Character } from '@/state/characters'
import { useSites } from '@/state/sites'

export default defineComponent({
  components: { ViewTitle, Header, Textfield, Select, Button, Toolbar, SpacerDiv },
  setup () {
    const i18n = useI18n()
    const { reroute } = useUxActions()
    const { createCharacter } = useCharacters()
    const { userSites } = useSites()
    const name = ref('')
    const system = ref('-')
    const site = ref('-')
    const opts = new Map<string, string>(
      [
        ['-', i18n.t('character.sheet.plain')],
        ['dd', i18n.t('character.sheet.dnd')],
        ['quick', i18n.t('character.sheet.quick')]
      ])
    const siteOpts = computed(() => {
      const arr = new Array<[string, string]>()
      arr.push(['-', i18n.t('character.meta.noSite')])
      userSites.value.forEach(site => {
        arr.push([site.id, site.name])
      })
      return arr
    })

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
      name,
      site,
      siteOpts
    }
  }
})
</script>
