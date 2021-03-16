<template>
  <div class="siteMetaView">
    <div class="viewFull">
      <SiteToolbar />
    </div>
    <transition name="fade">
      <div
        v-if="site && site.name"
        class="dashboardFlexSection"
      >
        <SiteMeta class="inDashboardBox" />
        <SiteIdentity class="inDashboardBox" />
        <Card class="inDashboardBox">
          <h1>{{ $t('mekanismi.site.owners') }}</h1>
          <OwnerPill
            v-for="owner in site.owners || []"
            :key="owner"
            :uid="owner"
          />
          <div
            v-if="actions"
            style="border-top: solid 1px black"
          >
            <p>{{ $t('mekanismi.site.addOwner') }}</p>
            <OwnerPill
              v-for="author in nonOwners"
              :key="author"
              :uid="author"
              :add="true"
            />
          </div>
        </Card>

        <Card
          v-if="isAdmin"
          class="contentArea"
        >
          {{ site }}
        </Card>
      </div>
      <Loader
        v-else
        style="position:absolute"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, provide } from 'vue'
import { useSite } from '@/state/site'
import Loader from '@/components/app/Loader.vue'
import OwnerPill from '@/components/sites/OwnerPill.vue'
import { useAuthors } from '@/state/authors'
import { useAuthState } from '@/state/authz'
import SiteMeta from '@/components/sites/SiteMeta.vue'
import SiteIdentity from '@/components/sites/SiteIdentity.vue'
import SiteToolbar from '@/components/sites/SiteToolbar.vue'
import Card from '@/components/layout/Card.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    Loader,
    OwnerPill,
    SiteMeta,
    SiteIdentity,
    SiteToolbar,
    Card
  },
  setup () {
    const { uid, isAdmin } = useAuthState()
    const { site, hasAdmin } = useSite()
    const { authors } = useAuthors()
    const nonOwners = computed(() => {
      const availableAuthors = authors.value.filter((author) => {
        return site.value.owners && !site.value.owners.includes(author.uid || '')
      })
      return availableAuthors.map((author) => (author?.uid || ''))
    })

    const actions = computed(() => hasAdmin(uid.value))

    provide('site', site)

    return { site, nonOwners, actions, isAdmin }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss

.dashboardFlexSection
  display: flex
  flex-direction: row
  flex-wrap: wrap
  .inDashboardBox
    min-width: 30vw

@include media('>tablet')
.dashboardFlexSection
  .inDashboardBox
    min-width: 520px
    max-width: 520px
    width:520px
</style>
