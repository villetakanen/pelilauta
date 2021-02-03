import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import { computed, ComputedRef, ref } from 'vue'
import { Site, toSite } from '@/state/site'

const fullSiteList = ref(new Map<string, Site>())

const allSites = computed(() => {
  const sites = Array.from(fullSiteList.value.values())
  sites.sort((a, b) => (a.name < b.name ? 0 : 1))
  return sites
})

const publicSites = computed(() => {
  const sites = Array.from(fullSiteList.value.values()).filter((a) => (!a.hidden))
  sites.sort((a, b) => (a.name < b.name ? 0 : 1))
  return sites
})

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

export function useSites (): { publicSites: ComputedRef<Array<Site>>, allSites: ComputedRef<Array<Site>>} {
  if (!_init) {
    subscribeToSites()
    _init = true
  }
  return { publicSites, allSites }
}
