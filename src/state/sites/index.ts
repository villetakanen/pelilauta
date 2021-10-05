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

export function useSites (): {
    publicSites: ComputedRef<Array<Site>>,
    allSites: ComputedRef<Array<Site>>,
    userSites: ComputedRef<Array<Site>>,
    } {
  if (!_init) {
    subscribeToSites()
    _init = true
  }
  return { publicSites, allSites, userSites }
}
