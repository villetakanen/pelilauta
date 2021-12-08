<template>
  <Column>
    <h1 class="title">
      {{ $t('mekanismi.site.meta') }}
    </h1>
    <p>
      <Textfield
        v-model="siteName"
        :label="$t('mekanismi.site.name')"
      />
      <Textfield
        v-model="siteDescription"
        :label="$t('mekanismi.site.description')"
      />
    </p>
    <div>
      <Select
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
    <Toolbar>
      <SpacerDiv />
      <Button @click.prevent="update">
        {{ $t('action.save') }}
      </Button>
    </Toolbar>
  </Column>
</template>

<script lang="ts">
import { useAuth } from '@/state/authz'
import { SiteDoc } from '@/state/site/Site'
import { computed, defineComponent, Ref, ref } from 'vue'
import Select from '../form/Select.vue'
import Column from '../layout/Column.vue'
import Icon from '../material/Icon.vue'
import Textfield from '../form/Textfield.vue'
import Toggle from '../material/Toggle.vue'
import { useSite } from '@/state/site'
import Button from '../form/Button.vue'
import SpacerDiv from '../layout/SpacerDiv.vue'
import Toolbar from '../layout/Toolbar.vue'

export default defineComponent({
  name: 'SiteMeta',
  components: {
    Textfield,
    Icon,
    Toggle,
    Column,
    Select,
    Button,
    SpacerDiv,
    Toolbar
  },
  setup () {
    const { site, updateSite } = useSite()

    const localName = ref('')
    const localBadge = ref('')
    const badge = computed({
      get: () => (localBadge.value || site.value.system),
      set: (val) => {
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
      const data: SiteDoc = { id: site.value.id }
      if (localName.value) data.name = localName.value
      if (localBadge.value) data.systemBadge = localBadge.value
      if (localDescription.value) data.description = localDescription.value
      if (localSiteVisible.value !== null) data.hidden = !siteVisible.value
      data.usePlayers = siteFeatures.value.players
      updateSite(data)
    }
    const badges = new Map([
      ['dd', 'Dungeons and Dragons 5e'],
      ['quick', 'The Quick'],
      ['homebrew', 'Homebrew'],
      ['ptba', 'Powered by the Apocalypse'],
      ['pathfinder', 'Pathfinder']
    ])
    const { showAdminTools } = useAuth()
    if (showAdminTools.value) badges.set('mekanismi', 'Mekanismi')
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
