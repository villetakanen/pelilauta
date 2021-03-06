<template>
  <div class="siteMetaView">
    <SiteToolbar />
    <transition name="fade">
      <div
        v-if="site && site.name"
        class="dashboardFlexSection"
      >
        <SiteMeta class="inDashboardBox" />
        <SiteIdentity class="inDashboardBox" />
        <SiteCategoriesCard class="inDashboardBox" />
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
import { useAuthors } from '@/state/authors'
import { useAuthState } from '@/state/authz'
import SiteMeta from '@/components/sites/SiteMeta.vue'
import SiteIdentity from '@/components/site/SiteIdentity.vue'
import SiteToolbar from '@/components/sites/SiteToolbar.vue'
import SiteCategoriesCard from '@/components/site/SiteCategoriesCard.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    Loader,
    SiteMeta,
    SiteIdentity,
    SiteToolbar,
    SiteCategoriesCard
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
  align-items: flex-start

@include media('<desktop')
  .dashboardFlexSection
    .inDashboardBox
      min-width: none
      max-width: none
      width: calc(100vw - 90px)

@include media('>=desktop')
  .dashboardFlexSection
    .inDashboardBox
      min-width: none
      max-width: none
      width: calc(30vw - 96px)
</style>
