<template>
  <Card>
    <h2>{{ $t('mekanismi.site.meta') }}</h2>
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
        :name="badge+ '-logo'"
        class="inlineIcon"
      />
      <div style="line-height: 48px">
        <Toggle
          v-model="siteVisible"
          :label="$t('wiki.site.visibleToggle')"
        />
      </div>
      <div style="line-height: 48px">
        <Toggle
          v-model="siteFeatures.players"
          :label="$t('site.meta.usePlayers')"
        />
      </div>
    </div>
    <div class="toolbar">
      <div class="spacer" />
      <MaterialButton :async-action="update">
        {{ $t('action.save') }}
      </MaterialButton>
    </div>
  </Card>
</template>

<script lang="ts">
import { Site, SiteData, updateSite } from '@/state/site'
import { computed, ComputedRef, defineComponent, inject, Ref, ref } from 'vue'
import Card from '../layout/Card.vue'
import Icon from '../material/Icon.vue'
import MaterialButton from '../material/MaterialButton.vue'
import MaterialSelect from '../material/MaterialSelect.vue'
import TextField from '../material/TextField.vue'
import Toggle from '../material/Toggle.vue'

export default defineComponent({
  components: { TextField, MaterialButton, MaterialSelect, Icon, Toggle, Card },
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
    const localSiteVisible:Ref<boolean|null> = ref(null)
    const siteVisible = computed({
      get: () => (localSiteVisible.value === null ? !site.value.hidden : localSiteVisible.value),
      set: (val) => { localSiteVisible.value = val }
    })
    const siteFeatures = ref({ players: site.value.usePlayers })
    async function update () {
      const data: SiteData = { id: site.value.id }
      if (localName.value) data.name = localName.value
      if (localBadge.value) data.systemBadge = localBadge.value
      if (localDescription.value) data.description = localDescription.value
      if (localSiteVisible.value !== null) data.hidden = !siteVisible.value
      data.usePlayers = siteFeatures.value.players
      updateSite(data)
    }
    const badges = [
      { key: 'dd', value: 'Dungeons and Dragons 5e' },
      { key: 'quick', value: 'The Quick' },
      { key: 'homebrew', value: 'Homebrew' },
      { key: 'ptba', value: 'Powered by the Apocalypse' },
      { key: 'pathfinder', value: 'Pathfinder' }
    ]
    return { site, siteName, siteDescription, update, badges, badge, siteVisible, siteFeatures }
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
