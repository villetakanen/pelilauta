import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import { computed, ComputedRef, ref } from 'vue'
import { Site, toSite, SiteData } from '@/state/site'

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
  const db = firebase.firestore()
  const siteRef = db.collection('sites').doc(siteData.id)
  return siteRef.get().then((siteDoc) => {
    if (siteDoc.exists) throw new Error('Site exists, create failed')
    return siteRef.set({ ...siteData, lastUpdate: firebase.firestore.FieldValue.serverTimestamp() }).then(() => {
      const pageRef = siteRef.collection('pages').doc(siteData.id)
      return pageRef.set({
        name: siteData.id,
        htmlContent: '<p>...</p>',
        lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
      })
    })
  })
}

let _init = false
let unsubscribe = () => {}

async function subscribeToSites () {
  unsubscribe()
  firebase.analytics().logEvent('Sites subscribed')
  const db = firebase.firestore()
  unsubscribe = db.collection('sites').orderBy('lastUpdate', 'desc').onSnapshot((snap) => {
    snap.docChanges().forEach((change) => {
      fullSiteList.value.set(change.doc.id, toSite(change.doc.id, change.doc.data()))
    })
  })
}

export function useSites (): {
    publicSites: ComputedRef<Array<Site>>,
    allSites: ComputedRef<Array<Site>>
    createSite: (id: string, creatorUid: string, name: string, hidden?: boolean) => Promise<void>
    } {
  if (!_init) {
    subscribeToSites()
    _init = true
  }
  return { publicSites, allSites, createSite }
}
