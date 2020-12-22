import { computed, ComputedRef, Ref, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import { useMembers, subscribeTo as subToMembers } from './members'
import { usePages, Page, subscribeTo as subToPages } from './pages'

let _init = false
const routeSiteid = ref('')
const siteid = computed(() => (routeSiteid))

export interface Site {
  siteid: string,
  description: string,
  hidden: boolean,
  silent: boolean,
  lastUpdate?: firebase.firestore.Timestamp,
  name: string
}

const stateSite:Ref<Site> = ref(toSite(null))
const site = computed(() => (stateSite.value))

let unsubscribe = () => {}

function toSite (id: string|null, data?:firebase.firestore.DocumentData): Site {
  if (id) {
    return {
      siteid: id,
      description: data?.description || '',
      hidden: data?.hidden || '',
      silent: data?.silent,
      lastUpdate: data?.lastUpdate,
      name: data?.data || id
    }
  }
  return {
    siteid: '',
    description: '',
    hidden: false,
    silent: false,
    name: ''
  }
}

function subscribeTo (id: string): void {
  stateSite.value = toSite(null)

  if (!id) {
    unsubscribe()
    return
  }

  firebase.analytics().logEvent('subscribe to Site', { id: id })

  const db = firebase.firestore()
  const siteRef = db.collection('sites').doc(id)
  unsubscribe = siteRef.onSnapshot((snap) => {
    if (snap.exists) {
      stateSite.value = toSite(id, snap.data())
    }
  })
}

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
      subscribeTo(routeSiteid.value)
      subToPages(routeSiteid.value)
      subToMembers(routeSiteid.value)
    },
    { immediate: true }
  )
}

function useSite (): { site: ComputedRef<Site> } {
  createSite()
  return { site }
}

export {
  createSite,
  Page,
  siteid,
  useMembers,
  usePages,
  useSite
}
