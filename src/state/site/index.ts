import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMembers, subscribeTo as subToMembers } from './members'
import { usePages, Page, subscribeTo as subToPages } from './pages'

let _init = false
const routeSiteid = ref('')
const siteid = computed(() => (routeSiteid))

/**
 * Creates Mekanismi State functionality for a site, and
 * starts Listening to changes for the site
 *
 * This functionality is not needed befor a user accesses a wiki site
 */
function createSite (): void {
  if (_init) return
  _init = true
  const route = useRoute()
  watch(
    route,
    () => {
      routeSiteid.value = Array.isArray(route.params.siteid) ? route.params.siteid[0] : route.params.siteid
      subToPages(routeSiteid.value)
      subToMembers(routeSiteid.value)
    },
    { immediate: true }
  )
}

export {
  createSite,
  Page,
  siteid,
  useMembers,
  usePages
}
