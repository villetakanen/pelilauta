<template>
  <MaterialCard>
    <h1>{{ $t('mekanismi.page.meta.title') }}</h1>
    <TextField
      v-model="pageName"
      :label="$t('mekanismi.page.name')"
    />
    <TextField
      v-model="pageCategory"
      :label="$t('mekanismi.page.category')"
    />
    <div class="toolbar">
      <div class="spacer" />
      <MaterialButton :action="update">
        {{ $t('action.save') }}
      </MaterialButton>
    </div>
  </MaterialCard>
</template>

<script lang="ts">
import { Page, Site, PageFragment, updatePage } from '@/state/site'
import { computed, ComputedRef, defineComponent, inject, ref } from 'vue'
import MaterialButton from '../material/MaterialButton.vue'
import MaterialCard from '../material/MaterialCard.vue'
import TextField from '../material/TextField.vue'

export default defineComponent({
  components: { MaterialCard, TextField, MaterialButton },
  setup () {
    const site = inject('site') as ComputedRef<Site>
    const page = inject('page') as ComputedRef<Page>
    const localName = ref('')
    const pageName = computed({
      get: () => (localName.value || page.value.name || page.value.id),
      set: (val) => { localName.value = val }
    })
    const localCategory = ref('')
    const pageCategory = computed({
      get: () => (localCategory.value || page.value.category || ''),
      set: (val) => { localCategory.value = val }
    })
    function update () {
      const data: PageFragment = { id: page.value.id, siteid: site.value.id }
      if (localName.value) data.name = localName.value
      if (localCategory.value) data.category = localCategory.value
      if (data.name || data.category) updatePage(data)
    }
    return { site, pageName, pageCategory, update }
  }
})
</script>
