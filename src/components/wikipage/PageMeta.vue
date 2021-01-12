<template>
  <MaterialCard>
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
import { Page, Site, SiteData, updateSite } from '@/state/site'
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
    const siteName = computed({
      get: () => (localName.value || site.value.name || site.value.id),
      set: (val) => { localName.value = val }
    })
    const localDescription = ref('')
    const siteDescription = computed({
      get: () => (localDescription.value || site.value.description || ''),
      set: (val) => { localDescription.value = val }
    })
    function update () {
      const data: PageData = { id: site.value.id }
      if (localName.value) data.name = localName.value
      if (localDescription.value) data.description = localDescription.value
      if (data.name || data.description) updateSite(data)
    }
    return { site, siteName, siteDescription, update }
  }
})
</script>
