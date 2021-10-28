import { computed, ComputedRef, ref } from 'vue'
import { Site, toSite } from '@/state/site'
import { collection, getFirestore, onSnapshot, orderBy, query } from '@firebase/firestore'
import { useAuth } from '../authz'

const fullSiteList = ref(new Map<string, Site>())

const allSites = computed(() => {
  const sites = Array.from(fullSiteList.value.values())
  return sites
})

const publicSites = computed(() => {
  const sites = Array.from(fullSiteList.value.values()).filter((a) => (!a.hidden))
  sites.sort((a, b) => ((a.lastUpdate || 0) > (b.lastUpdate || 0) ? -1 : 1))
  return sites
})

const userSites = computed(() => {
  const sites = Array.from(fullSiteList.value.values())
  const { user } = useAuth()
  const uid = user.value.uid
  const filteredSites = (sites.filter((s) => {
    if (Array.isArray(s.players) && s.players.includes(uid)) {
      return true
    }
    if (Array.isArray(s.owners) && s.owners.includes(uid)) {
      return true
    }
    return false
  }))
  return filteredSites
})

const visibleSites = computed(() => {
  const { user } = useAuth()
  return allSites.value.filter((val) => (
    !val.hidden ||
    (Array.isArray(val.owners) && val.owners.includes(user.value.uid)) ||
    (Array.isArray(val.players) && val.players.includes(user.value.uid))
  ))
})

let _init = false
let unsubscribe = () => {}

async function subscribeToSites () {
  unsubscribe()
  const db = getFirestore()
  const q = query(collection(db, 'sites'), orderBy('lastUpdate', 'desc'))
  unsubscribe = onSnapshot(q, (snap) => {
    snap.docChanges().forEach((change) => {
      fullSiteList.value.set(change.doc.id, toSite(change.doc.id, change.doc.data()))
    })
  })
}

export function sortByLastUpdate (a:Site, b:Site): number {
  if (a.lastUpdate && b.lastUpdate) {
    return a.lastUpdate.seconds < b.lastUpdate.seconds ? 1 : -1
  }
  return 0
}

export function useSites (): {
    publicSites: ComputedRef<Array<Site>>,
    allSites: ComputedRef<Array<Site>>,
    userSites: ComputedRef<Array<Site>>,
    visibleSites: ComputedRef<Array<Site>>,
    } {
  if (!_init) {
    subscribeToSites()
    _init = true
  }
  return { publicSites, allSites, userSites, visibleSites }
}
