import { computed, ComputedRef, ref } from 'vue'
import { collection, getFirestore, onSnapshot, orderBy, query, addDoc, serverTimestamp, setDoc, doc } from '@firebase/firestore'
import { useAuth } from '../authz'
import { SiteDoc, Site } from '@/state/site/Site'
import { logDebug } from '@/utils/eventLogger'

const fullSiteList = ref(new Map<string, Site>())

const allSites = computed(() => {
  const sites = Array.from(fullSiteList.value.values())
  return sites
})

const publicSites = computed(() => {
  const sites = [...allSites.value].filter(site => site.hidden === false)
  sites.sort((a, b) => (a.compareChangeTime(b)))
  logDebug(fullSiteList.value, sites)
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
  const q = query(collection(db, 'sites'))
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
  const sitedata = site.docData
  sitedata.createdAt = serverTimestamp()
  sitedata.updatedAt = serverTimestamp()

  const sitedoc = await addDoc(
    collection(
      getFirestore(),
      'sites'
    ),
    sitedata
  )

  const homePage = {
    name: 'Home',
    htmlContent: '<h1>Welcome to your new site!</h1>',
    authors: [user.value.uid],
    author: user.value.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }

  await setDoc(
    doc(
      getFirestore(),
      'sites',
      sitedoc.id,
      'pages',
      sitedoc.id
    ),
    homePage
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
