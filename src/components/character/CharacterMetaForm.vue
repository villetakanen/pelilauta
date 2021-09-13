<template>
  <Card>
    <Icon
      :name="site.systemBadge+'-logo'"
      headline
    />
    <MaterialSelect
      v-model="siteid"
      :opts="siteOpts"
      :label="$t('character.stats.game')"
    />
    <TextField
      v-model="charname"
      :label="$t('character.stats.name')"
      blur
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
import { useSite } from '@/state/site'
import Icon from '../material/Icon.vue'

export default defineComponent({
  name: 'CharacterMetaForm',
  components: { MaterialSelect, Card, TextField, Icon },
  setup () {
    const { characterid, character, updatePlayerCharacterFields } = useCharacters()
    const { userSites } = useSites()
    const { site } = useSite()
    const siteOpts = computed(() => {
      return userSites.value.filter((s) => (s.usePlayers)).map((s) => ({ key: s.id, value: s.name }))
    })
    const siteid = computed({
      get: () => (character?.value?.siteid ?? ''),
      set: (s: string) => {
        updatePlayerCharacterFields(characterid.value, { siteid: s })
        useSite(s)
      }
    })
    const charname = computed({
      get: () => (character?.value?.name ?? ''),
      set: (n: string) => {
        console.debug('name', n)
        if (n !== character?.value?.name) {
          updatePlayerCharacterFields(characterid.value, { name: n })
        }
      }
    })
    return { siteOpts, siteid, site, charname }
  }
})
</script>
