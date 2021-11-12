<template>
  <EditableColumn>
    <template #viewer>
      <p v-if="site">
        <Icon
          :name="site.systemBadge+'-logo'"
          small
        />
        {{ site.name }}
      </p>
      <p v-if="character">
        {{ character.name }}
      </p>
    </template>
    <template #editor>
      <Icon
        :name="site.systemBadge+'-logo'"
        medium
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
    </template>
  </EditableColumn>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import MaterialSelect from '../material/MaterialSelect.vue'
import { useSites } from '@/state/sites'
import { useCharacters } from '@/state/characters'
import TextField from '../material/TextField.vue'
import { useSite } from '@/state/site'
import Icon from '../material/Icon.vue'
import EditableColumn from '../layout/EditableColumn.vue'

export default defineComponent({
  name: 'CharacterMetaForm',
  components: { MaterialSelect, TextField, Icon, EditableColumn },
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
    return { siteOpts, siteid, site, charname, character }
  }
})
</script>
