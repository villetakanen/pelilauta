import { computed, ComputedRef, ref } from 'vue'
import { collection, getFirestore, onSnapshot, orderBy, query, addDoc } from '@firebase/firestore'
import { useAuth } from '../authz'
import { SiteDoc, Site } from '@/state/site/Site'

const fullSiteList = ref(new Map<string, Site>())

const allSites = computed(() => {
  const sites = Array.from(fullSiteList.value.values())
  return sites
})

const publicSites = computed(() => {
  const sites = Array.from(fullSiteList.value.values()).filter((a) => (!a.hidden))
  sites.sort((a, b) => (a.compareChangeTime(b)))
  return sites
})

const userSites = computed(() => {
  const sites = Array.from(fullSiteList.value.values())
  const { user } = useAuth()
  const uid = user.value.uid
  const filteredSites = sites.filter((a) => (a.hasEditor(uid)))
  return filteredSites
})

const visibleSites = computed(() => {
  const { user } = useAuth()
  return allSites.value.filter((val) => (
    !val.hidden ||
    val.hasEditor(user.value.uid)
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
      fullSiteList.value.set(change.doc.id, new Site(change.doc.id, change.doc.data() as SiteDoc))
    })
  })
}

export async function createSite (data: SiteDoc): Promise<string> {
  const { user } = useAuth()

  data.owners = [user.value.uid]

  const site = new Site(data)

  const sitedoc = await addDoc(
    collection(
      getFirestore(),
      'sites'
    ),
    site.docData
  )

  return sitedoc.id
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
