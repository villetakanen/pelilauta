<template>
  <div class="siteMetaView">
    <SiteToolbar />
    <transition name="fade">
      <main
        v-if="site && site.name"
        class="dashBoardLayout"
      >
        <SiteMeta class="inDashboardBox" />
        <SiteThemeTool />
        <SiteCategoriesCard class="inDashboardBox" />
      </main>
      <Loader v-else />
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, provide, watch } from 'vue'
import { useSite } from '@/state/site'
import Loader from '@/components/app/Loader.vue'
import { useAuthors } from '@/state/authors'
import SiteMeta from '@/components/site/SiteMeta.vue'
import SiteToolbar from '@/components/site/header/SiteToolbar.vue'
import SiteCategoriesCard from '@/components/site/SiteCategoriesCard.vue'
import { useAuth } from '@/state/authz'
import SiteThemeTool from '@/components/site/settings/SiteThemeTool.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    Loader,
    SiteMeta,
    SiteToolbar,
    SiteCategoriesCard,
    SiteThemeTool
  },
  props: {
    siteid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    onMounted(() => {
      watch(() => props.siteid, (siteid) => {
        useSite(siteid)
      }, { immediate: true })
    })
    const { user } = useAuth()
    const { site, hasAdmin } = useSite()
    const { authors } = useAuthors()
    const nonOwners = computed(() => {
      const availableAuthors = authors.value.filter((author) => {
        return site.value.owners && !site.value.owners.includes(author.uid || '')
      })
      return availableAuthors.map((author) => (author?.uid || ''))
    })

    const actions = computed(() => hasAdmin(user.value.uid))

    provide('site', site)

    return { site, nonOwners, actions }
  }
})
</script>
