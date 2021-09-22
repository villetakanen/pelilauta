import { computed, ComputedRef, ref } from 'vue'
import { Site, toSite, SiteData } from '@/state/site'
import { collection, doc, getDoc, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc } from '@firebase/firestore'
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

/**
 * Creates a new wikisite, and a page to accompany it
 *
 * @param data SiteData, with fields owners
 */
async function createSite (id: string, creatorUid: string, name: string, hidden = true): Promise<void> {
  const siteData:SiteData = {
    id: id,
    name: name,
    owners: [creatorUid],
    hidden: hidden
  }
  const db = getFirestore()
  const siteRef = doc(db, 'sites', siteData.id)
  return getDoc(siteRef).then((siteDoc) => {
    if (siteDoc.exists()) throw new Error('Site exists, create failed')
    return setDoc(siteRef, { ...siteData, lastUpdate: serverTimestamp() }).then(() => {
      const pageRef = doc(db, 'pages', siteData.id)
      return setDoc(pageRef, {
        name: siteData.id,
        htmlContent: '<p>...</p>',
        lastUpdate: serverTimestamp()
      })
    })
  })
}

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
    createSite: (id: string, creatorUid: string, name: string, hidden?: boolean) => Promise<void>
    } {
  if (!_init) {
    subscribeToSites()
    _init = true
  }
  return { publicSites, allSites, createSite, userSites }
}
