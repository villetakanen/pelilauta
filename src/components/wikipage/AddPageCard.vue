<template>
  <MaterialCard>
    <h1>{{ $t('mekanismi.addPageCard.title') }}</h1>
    <TextField v-model="newPageTitle" />
    <p class="caption">
      {{ newPageUrl }}
    </p>
    <div class="cardToolbar toolbar">
      <div class="spacer" />
      <MaterialButton :text="true">
        {{ $t('action.cancel') }}
      </MaterialButton>
      <MaterialButton :disabled="!newPageTitle">
        {{ $t('action.create') }}
      </MaterialButton>
    </div>
  </MaterialCard>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, inject, ref } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import TextField from '../material/TextField.vue'
import MaterialButton from '../material/MaterialButton.vue'
import { Site } from '@/state/site'

export default defineComponent({
  name: 'AddPageCard',
  components: {
    MaterialCard,
    TextField,
    MaterialButton
  },
  setup () {
    const newPageTitle = ref('')
    const newPageUrl = computed(() => (window.location.host + '/' + site.value.id + '/' + newPageTitle.value))
    const site = inject('site') as ComputedRef<Site>
    return { newPageTitle, newPageUrl }
  }
})
</script>
