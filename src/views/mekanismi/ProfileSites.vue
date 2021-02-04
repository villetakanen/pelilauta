<template>
  <div class="viewFull">
    <SiteListToolbar />
    <MaterialCard>
      <div class="siteGrid">
        <template
          v-for="site in mySites"
          :key="site.id"
          class="siteGrid"
        >
          <div
            class="siteCell"
            :class="{hidden: site.hidden}"
          >
            <router-link :to="`/mekanismi/view/${site.id}/${site.id}`">
              {{ site.name }}
            </router-link>
          </div>
          <div class="siteCell">
            <Icon
              v-if="site.hidden"
              name="hidden"
              style="opacity: 0.22"
            />
            <Icon
              v-else
              :name="site.systemBadge + '-logo'"
            />
          </div>
          <div
            class="siteCell"
            :class="{hidden: site.hidden}"
          >
            {{ site.description }}
          </div>
          <div
            class="siteCell"
            :class="{hidden: site.hidden}"
          >
            {{ toDisplayString(site.lastUpdate) }}
          </div>
        </template>
      </div>
    </MaterialCard>
  </div>
</template>

<script lang="ts">
import MaterialCard from '@/components/material/MaterialCard.vue'
import SiteListToolbar from '@/components/sites/SiteListToolbar.vue'
import { useAuthState, useProfile } from '@/state/authz'
import { useSites } from '@/state/sites'
import { computed, defineComponent } from 'vue'
import { toDisplayString } from '@/utils/firebaseTools'
import Icon from '@/components/material/Icon.vue'

export default defineComponent({
  components: { MaterialCard, SiteListToolbar, Icon },
  setup () {
    const { uid } = useAuthState()
    const { profile } = useProfile()
    const { allSites } = useSites()
    const mySites = computed(() => (allSites.value.filter((val) => (Array.isArray(val.owners)) && val.owners.includes(uid.value))))
    return { profile, mySites, toDisplayString }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.siteGrid
  display: grid
  grid-template-columns: auto auto 1fr auto
  grid-gap: 8px
  div.icon
    height: 24px
    width: 24px
  div.hidden
    opacity: 0.44
    a
      color: $color-fill-tertiary
</style>
