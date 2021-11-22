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
      <Textfield
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
import Textfield from '../form/Textfield.vue'
import { useSite } from '@/state/site'
import Icon from '../material/Icon.vue'
import EditableColumn from '../layout/EditableColumn.vue'
import { logDebug } from '@/utils/eventLogger'

export default defineComponent({
  name: 'CharacterMetaForm',
  components: { MaterialSelect, Textfield, Icon, EditableColumn },
  props: {
    characterid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { characters } = useCharacters()
    const character = computed(() => characters.value.get(props.characterid))
    const { userSites } = useSites()
    const { site } = useSite()
    const siteOpts = computed(() => {
      return userSites.value.filter((s) => (s.usePlayers)).map((s) => ({ key: s.id, value: s.name }))
    })

    const charname = computed({
      get: () => (character?.value?.name ?? ''),
      set: (n: string) => {
        logDebug('CharacterMetaForm.charname.set', n)
      }
    })
    return { siteOpts, site, charname, character }
  }
})
</script>
