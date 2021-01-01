import { computed, ComputedRef, Ref, ref } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import { useMembers } from './members'
import { usePages, Page, fetchPage, subscribeTo as subscribeToPages, updatePage } from './pages'

export interface Site {
  id: string,
  description: string,
  hidden: boolean,
  silent: boolean,
  lastUpdate?: firebase.firestore.Timestamp,
  name: string
}

const stateSite:Ref<Site> = ref(toSite())
const site = computed(() => (stateSite.value))

/**
 * Creates a new site struct. The struct is empty if no values are given.
 *
 * @param id siteDoc.id from firestore
 * @param data siteDoc.data() from firestore
 */
function toSite (id?: string, data?:firebase.firestore.DocumentData): Site {
  if (id) {
    return {
      id: id,
      description: data?.description || '',
      hidden: data?.hidden || '',
      silent: data?.silent,
      lastUpdate: data?.lastUpdate,
      name: data?.data || id
    }
  }
  return {
    id: '',
    description: '',
    hidden: false,
    silent: false,
    name: ''
  }
}

let unsubscribe = () => {}

function subscribeTo (id: string): void {
  if (id === stateSite.value.id) {
    return
  }

  if (!id) {
    stateSite.value = toSite()
    unsubscribe()
    return
  }

  subscribeToPages(id)

  firebase.analytics().logEvent('Subscribing Site', { id: id })

  const db = firebase.firestore()
  const siteRef = db.collection('sites').doc(id)
  unsubscribe = siteRef.onSnapshot((snap) => {
    if (snap.exists) {
      stateSite.value = toSite(id, snap.data())
    }
  })
}

function useSite (id?: string): { site: ComputedRef<Site> } {
  if (id) subscribeTo(id)
  return { site }
}

export {
  // createSite,
  Page,
  useMembers,
  usePages,
  useSite,
  subscribeTo,
  fetchPage,
  updatePage
}
