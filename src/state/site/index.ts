import { computed, ComputedRef, Ref, ref } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import { usePage, usePages, Page, fetchPage, subscribeTo as subscribeToPages, updatePage, addPage, PageFragment, deletePage } from './pages'
import { refreshStorage, useFiles } from './attachments'
import { useAssets, subscribeTo as subscribeToAssets } from './assets'
import { useAuthors } from '../authors'
import { PublicProfile } from '../authz'

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
  systemBadge: string
  usePlayers: boolean
}
export interface SiteData {
  id: string,
  name?: string,
  description?: string,
  splashURL?: string,
  systemBadge?: string,
  owners?: string[],
  lastUpdate?: firebase.firestore.Timestamp,
  hidden?: boolean,
  usePlayers?: boolean
  players?: string[]
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
      hidden: data?.hidden || false,
      silent: data?.silent,
      lastUpdate: data?.lastUpdate || null,
      name: data?.name || id,
      players: data?.players || null,
      owners: data?.owners || null,
      splashURL: data?.splashURL || '',
      systemBadge: data?.systemBadge || '',
      usePlayers: data?.usePlayers || false
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
    splashURL: '',
    systemBadge: '',
    usePlayers: true
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
  subscribeToAssets(id)

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

async function addPlayer (uid:string) {
  console.debug('addPlayer', stateSite.value.id, uid)
  const playersArray = Array.isArray(stateSite.value.players) ? stateSite.value.players : new Array<string>()
  if (!playersArray.includes(uid)) playersArray.push(uid)
  return updateSite({ id: stateSite.value.id, players: playersArray })
}
async function removePlayer (uid:string) {
  console.debug('removePlayer', stateSite.value.id, uid)
  const playersArray = Array.isArray(stateSite.value.players)
    ? stateSite.value.players.filter((p) => (p !== uid))
    : new Array<string>()
  return updateSite({ id: stateSite.value.id, players: playersArray })
}

async function updateSite (data: SiteData): Promise<void> {
  console.debug('updateSite', stateSite.value.id, data)
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

const members = computed(() => {
  const { authors } = useAuthors()
  const m = new Array<PublicProfile>()

  let uids = site.value.owners ? [...site.value.owners] : new Array<string>()
  if (site.value.players) uids = [...uids, ...site.value.players]

  uids?.forEach((uid) => {
    const a = authors.value.find((f) => (f.uid === uid))
    if (a && a.nick) m.push(a)
  })

  return m
})

function useSite (id?: string):
  {
    site: ComputedRef<Site>,
    members: ComputedRef<Array<PublicProfile>>,
    hasAdmin: (uid: string) => boolean,
    revokeOwner: (uid: string) => Promise<void>
    addOwner: (uid: string) => Promise<void>,
    addPlayer: (uid: string) => Promise<void>,
    removePlayer: (uid: string) => Promise<void>,
  } {
  if (id) subscribeTo(id)
  return { hasAdmin, site, revokeOwner, addOwner, addPlayer, removePlayer, members }
}

export {
  // createSite,
  addPage,
  deletePage,
  fetchPage,
  Page,
  PageFragment,
  useFiles,
  usePage,
  usePages,
  useSite,
  subscribeTo,
  updatePage,
  updateSite,
  useAssets
}
