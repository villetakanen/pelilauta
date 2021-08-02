<template>
  <Card class="charactersCard">
    <h1 class="title">
      {{ $t('site.characters.title') }}
    </h1>
    <div>
      <MaterialSelect :label="$t('site.characters.template')" />
      <MaterialButton />
    </div>
  </Card>
</template>

<script lang="ts">
import Card from '@/components/layout/Card.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import MaterialSelect from '@/components/material/MaterialSelect.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: { Card, MaterialSelect, MaterialButton }
})
</script>

<style lang="sass" scoped>
</style>
