import { computed, ComputedRef, Ref, ref } from 'vue'
import { fetchPage, usePages, Page, subscribeTo as subscribeToPages, updatePage, addPage, PageFragment, deletePage } from './pages'
import { refreshStorage, useFiles } from './attachments'
import { useAssets, subscribeTo as subscribeToAssets } from './assets'
import { useAuthors } from '../authors'
import { PublicProfile, useAuth } from '../authz'
import { PageCategory, defaultCategories, unmarshallCategories, marshallCategories } from './pagecategory'
import { doc, DocumentData, getDoc, getFirestore, onSnapshot, Timestamp, updateDoc, addDoc, collection } from '@firebase/firestore'
import { getAnalytics, logEvent } from '@firebase/analytics'
import { subscribeCharacters, useSiteCharacters } from './characters'
import { PageLogEntry } from '../pages/usePage'

export const siteTypes = new Map([
  ['dd', 'Dungeons and Dragons 5e'],
  ['quick', 'The Quick'],
  ['homebrew', 'Homebrew'],
  ['ptba', 'Powered by the Apocalypse'],
  ['pathfinder', 'Pathfinder']
])

export interface Site {
  id: string,
  description: string,
  hidden: boolean,
  silent: boolean,
  lastUpdate?: Timestamp,
  name: string
  owners: string[]|null
  players: string[]|null
  splashURL: string
  systemBadge: string
  usePlayers: boolean
  categories: PageCategory[],
  hasCategories?: boolean
  latestPages?: PageLogEntry[]
}
export interface SiteData {
  id?: string,
  name?: string,
  description?: string,
  splashURL?: string,
  systemBadge?: string,
  owners?: string[],
  lastUpdate?: Timestamp,
  hidden?: boolean,
  usePlayers?: boolean
  players?: string[],
  categories?: PageCategory[]
}

const stateSite:Ref<Site> = ref(toSite())
const site = computed(() => (stateSite.value))

/**
 * Creates a new site struct. The struct is empty if no values are given.
 *
 * @param id siteDoc.id from firestore
 * @param data siteDoc.data() from firestore
 */
export function toSite (id?: string, data?:DocumentData): Site {
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
      usePlayers: data?.usePlayers || false,
      categories: data?.categories ? marshallCategories(data?.categories) : defaultCategories(),
      hasCategories: Array.isArray(data?.categories),
      latestPages: data?.latestPages || undefined
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
    usePlayers: true,
    categories: defaultCategories()
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
  subscribeCharacters(id)

  logEvent(getAnalytics(), 'Subscribing Site', { id: id })

  const db = getFirestore()
  const siteRef = doc(db, 'sites', id)
  unsubscribe = onSnapshot(siteRef, (snap) => {
    if (snap.exists()) {
      stateSite.value = toSite(id, snap.data())
    }
  })
}

function hasAdmin (uid?: string): boolean {
  const { user } = useAuth()
  const queriedUid = uid || user.value.uid
  if (stateSite.value.owners === null) return false
  return stateSite.value.owners.includes(queriedUid)
}

async function addPlayer (uid:string) {
  const playersArray = Array.isArray(stateSite.value.players) ? stateSite.value.players : new Array<string>()
  if (!playersArray.includes(uid)) playersArray.push(uid)
  return updateSite({ id: stateSite.value.id, players: playersArray })
}
async function removePlayer (uid:string) {
  const playersArray = Array.isArray(stateSite.value.players)
    ? stateSite.value.players.filter((p) => (p !== uid))
    : new Array<string>()
  return updateSite({ id: stateSite.value.id, players: playersArray })
}

export async function createSite (data: SiteData): Promise<string> {
  const { user } = useAuth()

  data.owners = [user.value.uid]

  const sitedoc = await addDoc(
    collection(
      getFirestore(),
      'sites'
    ),
    data
  )

  return sitedoc.id
}

async function updateSite (data: SiteData): Promise<void> {
  console.debug('updateSite', stateSite.value.id, data)

  const update = { ...data }
  if (data.categories) update.categories = unmarshallCategories(data.categories)

  return updateDoc(
    doc(getFirestore(), 'sites', stateSite.value.id),
    update
  )
}

async function revokeOwner (uid: string) {
  const db = getFirestore()
  const siteRef = doc(db, 'sites', stateSite.value.id)
  getDoc(siteRef).then((doc) => {
    if (!doc.exists) throw new Error('Trying to remove an owner from non-existing site')
    let owners = doc.data()?.owners
    if (!Array.isArray(owners)) throw new Error('Trying to remove an owner, from pre 6.0 site data')
    owners = owners.filter((owner) => (owner !== uid))
    return updateDoc(siteRef, { owners: owners })
  })
}

async function addOwner (uid: string) {
  const db = getFirestore()
  const siteRef = doc(db, 'sites', stateSite.value.id)
  getDoc(siteRef).then((doc) => {
    if (!doc.exists) throw new Error('Trying to remove an owner from non-existing site')
    let owners = doc.data()?.owners
    if (!Array.isArray(owners)) throw new Error('Trying to remove an owner, from pre 6.0 site data')
    owners = owners.filter((owner) => (owner !== uid))
    owners.push(uid)
    return updateDoc(siteRef, { owners: owners })
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

const showSiteMemberTools = computed(() => {
  const { user } = useAuth()
  if (site.value.owners?.includes(user.value.uid)) return true
  if (site.value.players?.includes(user.value.uid)) return true
  return false
})

function useSite (id?: string):
  {
    site: ComputedRef<Site>,
    members: ComputedRef<Array<PublicProfile>>,
    showSiteMemberTools: ComputedRef<boolean>,
    hasAdmin: (uid?: string) => boolean,
    revokeOwner: (uid: string) => Promise<void>
    addOwner: (uid: string) => Promise<void>,
    addPlayer: (uid: string) => Promise<void>,
    removePlayer: (uid: string) => Promise<void>,
  } {
  if (id) subscribeTo(id)
  return { hasAdmin, site, revokeOwner, addOwner, addPlayer, removePlayer, members, showSiteMemberTools }
}

export {
  // createSite,
  addPage,
  deletePage,
  fetchPage,
  Page,
  PageFragment,
  useFiles,
  usePages,
  useSite,
  subscribeTo,
  updatePage,
  updateSite,
  useAssets,
  useSiteCharacters
}
