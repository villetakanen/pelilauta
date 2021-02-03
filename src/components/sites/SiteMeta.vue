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
      &nbsp;<Icon
        :name="site.systemBadge+ '-logo'"
        class="inlineIcon"
      />
    </div>
    <div class="toolbar">
      <div class="spacer" />
      <MaterialButton :async-action="update">
        {{ $t('action.save') }}
      </MaterialButton>
    </div>
  </MaterialCard>
</template>

<script lang="ts">
import { Site, SiteData, updateSite } from '@/state/site'
import { computed, ComputedRef, defineComponent, inject, ref } from 'vue'
import Icon from '../material/Icon.vue'
import MaterialButton from '../material/MaterialButton.vue'
import MaterialCard from '../material/MaterialCard.vue'
import MaterialSelect from '../material/MaterialSelect.vue'
import TextField from '../material/TextField.vue'

export default defineComponent({
  components: { MaterialCard, TextField, MaterialButton, MaterialSelect, Icon },
  setup () {
    const site = inject('site') as ComputedRef<Site>
    const localName = ref('')
    const localBadge = ref('')
    const badge = computed({
      get: () => (localBadge.value || site.value.systemBadge),
      set: (val) => {
        console.log('to', val)
        localBadge.value = val
      }
    })
    const siteName = computed({
      get: () => (localName.value || site.value.name || site.value.id),
      set: (val) => { localName.value = val }
    })
    const localDescription = ref('')
    const siteDescription = computed({
      get: () => (localDescription.value || site.value.description || ''),
      set: (val) => { localDescription.value = val }
    })
    async function update () {
      const data: SiteData = { id: site.value.id }
      if (localName.value) data.name = localName.value
      if (localBadge.value) data.systemBadge = localBadge.value
      if (localDescription.value) data.description = localDescription.value
      if (data.name || data.description || localBadge.value !== site.value.systemBadge) updateSite(data)
    }
    const badges = [
      { key: '-', value: '' },
      { key: 'dd', value: 'Dungeons and Dragons 5e' },
      { key: 'quick', value: 'The Quick' },
      { key: 'ptba', value: 'Powered by the Apocalypse' }
    ]
    return { site, siteName, siteDescription, update, badges, badge }
  }
})
</script>

<style lang="sass">
div.inlineIcon
  &.icon
    margin:0
    height: 2em
    width: 2em
    img
      margin:0
      width: 2em
      height: 2em
      vertical-align: middle
</style>
