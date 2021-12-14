import { computed, ComputedRef, Ref, ref } from 'vue'
import { fetchPage, usePages, Page, subscribeTo as subscribeToPages, updatePage, addPage, PageFragment, deletePage } from './pages'
import { refreshStorage, useFiles } from './attachments'
import { useAssets, subscribeTo as subscribeToAssets } from './assets'
import { useAuthors } from '../authors'
import { PublicProfile, useAuth } from '../authz'
import { doc, getDoc, getFirestore, onSnapshot, updateDoc, serverTimestamp, DocumentData } from '@firebase/firestore'
import { getAnalytics, logEvent } from '@firebase/analytics'
import { useSiteCharacters } from './useSiteCharacters'
import { Site, SiteDoc, SiteModel } from '../store/Site'

export const siteTypes = new Map([
  ['dd', 'Dungeons and Dragons 5e'],
  ['quick', 'The Quick'],
  ['homebrew', 'Homebrew'],
  ['ptba', 'Powered by the Apocalypse'],
  ['pathfinder', 'Pathfinder']
])

const stateSite: Ref<SiteModel> = ref(new Site())
const site = computed(() => (stateSite.value))

let unsubscribe = () => {}

function subscribeTo (id: string): void {
  if (id === stateSite.value.id) {
    return
  }

  if (!id) {
    stateSite.value = new Site()
    unsubscribe()
    return
  }
  refreshStorage(id)
  subscribeToPages(id)
  subscribeToAssets(id)

  logEvent(getAnalytics(), 'Subscribing Site', { id: id })

  const db = getFirestore()
  const siteRef = doc(db, 'sites', id)
  unsubscribe = onSnapshot(siteRef, (snap) => {
    if (snap.exists()) {
      stateSite.value = new Site(id, snap.data() as SiteDoc)
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
  console.log('Adding player', uid)
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

async function updateSite (data: DocumentData): Promise<void> {
  console.debug('updateSite', stateSite.value.id, data)

  const update = { ...data }
  update.updatedAt = serverTimestamp()

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
    return updateDoc(siteRef, {
      owners: owners,
      updatedAt: serverTimestamp()
    })
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
    return updateDoc(
      siteRef,
      {
        owners: owners,
        updatedAt: serverTimestamp()
      }
    )
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

const showSiteAdminTools = computed(() => {
  const { user } = useAuth()
  if (site.value.owners?.includes(user.value.uid)) return true
  return false
})

function useSite (id?: string):
  {
    site: ComputedRef<SiteModel>,
    members: ComputedRef<Array<PublicProfile>>,
    showSiteMemberTools: ComputedRef<boolean>,
    showSiteAdminTools: ComputedRef<boolean>,
    hasAdmin: (uid?: string) => boolean,
    revokeOwner: (uid: string) => Promise<void>
    addOwner: (uid: string) => Promise<void>,
    addPlayer: (uid: string) => Promise<void>,
    removePlayer: (uid: string) => Promise<void>,
    updateSite: (data: DocumentData) => Promise<void>
  } {
  if (id) subscribeTo(id)
  return { hasAdmin, site, revokeOwner, addOwner, addPlayer, removePlayer, members, showSiteMemberTools, showSiteAdminTools, updateSite }
}

export {
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
