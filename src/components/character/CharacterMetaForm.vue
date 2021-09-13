<template>
  <Card>
    <h1 class="title">
      {{ $t('character.meta.title') }}
    </h1>
    <TextField :label="$t('character.stats.name')" />
    <MaterialSelect
      v-model="site"
      :opts="siteOpts"
      :label="$t('character.stats.game')"
    />
  </Card>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import MaterialSelect from '../material/MaterialSelect.vue'
import Card from '../layout/Card.vue'
import { useSites } from '@/state/sites'
import { useCharacters } from '@/state/characters'
import TextField from '../material/TextField.vue'

export default defineComponent({
  name: 'CharacterMetaForm',
  components: { MaterialSelect, Card, TextField },
  setup () {
    const { characterid, character, updatePlayerCharacterFields } = useCharacters()
    const { userSites } = useSites()
    const siteOpts = computed(() => {
      return userSites.value.filter((s) => (s.usePlayers)).map((s) => ({ key: s.id, value: s.name }))
    })
    const site = computed({
      get: () => (character?.value?.siteid ?? ''),
      set: (s: string) => {
        updatePlayerCharacterFields(characterid.value, { siteid: s })
      }
    })
    return { siteOpts, site }
  }
})
</script>
