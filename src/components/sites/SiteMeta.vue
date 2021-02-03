<template>
  <MaterialCard>
    <h1>{{ $t('mekanismi.site.meta') }}</h1>
    <div>
      <TextField
        v-model="siteName"
        :label="$t('mekanismi.site.name')"
      />
      <TextField
        v-model="siteDescription"
        :label="$t('mekanismi.site.description')"
      />
      <MaterialSelect
        v-model="badge"
        :opts="badges"
        name="systemBadge"
        :label="$t('wiki.site.badge')"
      />
    </div>
    <div class="toolbar">
      <div class="spacer" />
      <MaterialButton :action="update">
        {{ $t('action.save') }}
      </MaterialButton>
    </div>
  </MaterialCard>
</template>

<script lang="ts">
import { Site, SiteData, updateSite } from '@/state/site'
import { computed, ComputedRef, defineComponent, inject, ref } from 'vue'
import MaterialButton from '../material/MaterialButton.vue'
import MaterialCard from '../material/MaterialCard.vue'
import MaterialSelect from '../material/MaterialSelect.vue'
import TextField from '../material/TextField.vue'

export default defineComponent({
  components: { MaterialCard, TextField, MaterialButton, MaterialSelect },
  setup () {
    const site = inject('site') as ComputedRef<Site>
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
      const data: SiteData = { id: site.value.id }
      if (localName.value) data.name = localName.value
      if (localDescription.value) data.description = localDescription.value
      if (data.name || data.description) updateSite(data)
    }
    const badges = [{ key: 'dd', value: 'Dungeons and Dragons 5e' }]
    return { site, siteName, siteDescription, update, badges }
  }
})
</script>
