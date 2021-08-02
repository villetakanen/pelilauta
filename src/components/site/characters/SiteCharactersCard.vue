<template>
  <Card class="charactersCard">
    <h1 class="title">
      {{ $t('site.characters.title') }}
    </h1>
    <div>
      <MaterialSelect
        :label="$t('site.characters.template')"
        :opts="templates"
        model-value="default"
      />
      <MaterialButton>{{ $t('action.add') }}</MaterialButton>
    </div>
  </Card>
</template>

<script lang="ts">
import Card from '@/components/layout/Card.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import MaterialSelect from '@/components/material/MaterialSelect.vue'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: { Card, MaterialSelect, MaterialButton },
  setup () {
    const i18n = useI18n()
    const templates = [
      { key: 'default', value: i18n.t('site.characters.templates.default') },
      { key: 'll', value: i18n.t('site.characters.templates.ll') }
    ]
    return { templates }
  }
})
</script>

<style lang="sass" scoped>
</style>
