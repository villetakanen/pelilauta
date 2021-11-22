<template>
  <Card class="charactersCard">
    <h1 class="title">
      {{ $t('site.characters.title') }}
    </h1>
    <div
      v-for="pc in pcs"
      :key="pc[0]"
    >
      <router-link :to="`/site/${site.id}/character/${pc[0]}`">
        {{ pc[1].name }}
      </router-link>
    </div>
    <div>
      <MaterialSelect
        v-model="newCharType"
        :label="$t('site.characters.template')"
        :opts="templates"
      />
      <MaterialButton :async-action="addCharacter">
        {{ $t('action.add') }}
      </MaterialButton>
    </div>
  </Card>
</template>

<script lang="ts">
import Card from '@/components/layout/Card.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import MaterialSelect from '@/components/material/MaterialSelect.vue'
import { useCharacters } from '@/state/characters'
import { useSite } from '@/state/site'
import { logDebug, logError } from '@/utils/eventLogger'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: { Card, MaterialSelect, MaterialButton },
  setup () {
    const i18n = useI18n()
    const newCharType = ref('default')
    const templates = [
      { key: 'default', value: i18n.t('site.characters.templates.default') },
      { key: 'll', value: i18n.t('site.characters.templates.ll') }
    ]
    const { characters: pcs } = useCharacters()
    async function addCharacter () {
      try {
        // const newCharID = await addPlayerCharacter(newCharType.value)
        logError('missing functionality')
      } catch (e) {
        console.error(e)
      }
    }
    const { site } = useSite()
    return { templates, pcs, newCharType, addCharacter, site }
  }
})
</script>

<style lang="sass" scoped>
</style>
