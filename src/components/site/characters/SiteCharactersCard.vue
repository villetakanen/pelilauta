<template>
  <Card class="charactersCard">
    <h1 class="title">
      {{ $t('site.characters.title') }}
    </h1>
    <div
      v-for="pc in pcs"
      :key="pc[0]"
    >
      {{ pc[1].name }}
    </div>
    <div>
      <MaterialSelect
        :label="$t('site.characters.template')"
        :opts="templates"
        :model-value="newCharType"
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
    const { characters: pcs, addPlayerCharacter } = useCharacters()
    async function addCharacter () {
      try {
        const newCharID = await addPlayerCharacter(newCharType.value)
        console.debug('added player character', newCharID)
      } catch (e) {
        console.error(e)
      }
    }
    return { templates, pcs, newCharType, addCharacter }
  }
})
</script>

<style lang="sass" scoped>
</style>
