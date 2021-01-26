import { computed, ComputedRef, Ref, ref } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import { useMembers } from './members'
import { usePages, Page, fetchPage, subscribeTo as subscribeToPages, updatePage, addPage, PageFragment } from './pages'
import { refreshStorage, useFiles } from './attachments'

export interface Site {
  id: string,
  description: string,
  hidden: boolean,
  silent: boolean,
  lastUpdate?: firebase.firestore.Timestamp,
  name: string
  owners: string[]|null
  players: string[]|null
  splashURL: string
}
export interface SiteData {
  id: string,
  name?: string,
  description?: string,
  splashURL?: string
}

const stateSite:Ref<Site> = ref(toSite())
const site = computed(() => (stateSite.value))

/**
 * Creates a new site struct. The struct is empty if no values are given.
 *
 * @param id siteDoc.id from firestore
 * @param data siteDoc.data() from firestore
 */
export function toSite (id?: string, data?:firebase.firestore.DocumentData): Site {
  if (id) {
    return {
      id: id,
      description: data?.description || '',
      hidden: data?.hidden || '',
      silent: data?.silent,
      lastUpdate: data?.lastUpdate || null,
      name: data?.name || id,
      players: data?.players || null,
      owners: data?.owners || null,
      splashURL: data?.splashURL || ''
    }
  }
  return {
    id: '',
    description: '',
    hidden: false,
    silent: false,
    name: '',
    players: null,
    owners: null,
    splashURL: ''
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
  refreshStorage(id)
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

function hasAdmin (uid: string): boolean {
  if (stateSite.value.owners === null) return false
  return stateSite.value.owners.includes(uid)
}

async function updateSite (data: SiteData): Promise<void> {
  const db = firebase.firestore()
  const siteRef = db.collection('sites').doc(stateSite.value.id)
  return siteRef.update(data)
}

async function revokeOwner (uid: string) {
  const db = firebase.firestore()
  const siteRef = db.collection('sites').doc(stateSite.value.id)
  siteRef.get().then((doc) => {
    if (!doc.exists) throw new Error('Trying to remove an owner from non-existing site')
    let owners = doc.data()?.owners
    if (!Array.isArray(owners)) throw new Error('Trying to remove an owner, from pre 6.0 site data')
    owners = owners.filter((owner) => (owner !== uid))
    return siteRef.update({ owners: owners })
  })
}

async function addOwner (uid: string) {
  const db = firebase.firestore()
  const siteRef = db.collection('sites').doc(stateSite.value.id)
  siteRef.get().then((doc) => {
    if (!doc.exists) throw new Error('Trying to remove an owner from non-existing site')
    let owners = doc.data()?.owners
    if (!Array.isArray(owners)) throw new Error('Trying to remove an owner, from pre 6.0 site data')
    owners = owners.filter((owner) => (owner !== uid))
    owners.push(uid)
    return siteRef.update({ owners: owners })
  })
}

function useSite (id?: string):
  {
    site: ComputedRef<Site>,
    hasAdmin: (uid: string) => boolean,
    revokeOwner: (uid: string) => Promise<void>
    addOwner: (uid: string) => Promise<void>
  } {
  if (id) subscribeTo(id)
  return { hasAdmin, site, revokeOwner, addOwner }
}

export {
  // createSite,
  addPage,
  fetchPage,
  Page,
  PageFragment,
  useFiles,
  useMembers,
  usePages,
  useSite,
  subscribeTo,
  updatePage,
  updateSite
}
