import { computed, ComputedRef, Ref, ref, watch } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import { useMeta } from '@/state/meta'
import { useAuthState } from './state'
import { fetchAssets, useAssets } from './assets'
import { setSeen, useInbox } from '@/state/inbox'
import { useAuth } from '.'

export interface PublicProfile {
  uid?: string
  nick: string
  tagline?: string
  photoURL?: string
}

export interface ProfileMeta {
  lovedThreads: Array<string>
  seenThreads: Map<string, firebase.firestore.Timestamp>
  pelilautaLang?: string
  allThreadsSeenSince?: firebase.firestore.Timestamp
}

const isAdmin: ComputedRef<boolean> = computed(() => {
  const { uid } = useAuthState()
  const { admins } = useMeta()
  return admins.value.includes(uid.value)
})

const profileRef:Ref<PublicProfile> = ref({
  nick: '',
  tagline: '',
  frozen: false
})
const profile = computed(() => profileRef.value)

const profileMetaRef:Ref<ProfileMeta> = ref({
  lovedThreads: new Array<string>(),
  seenThreads: new Map<string, firebase.firestore.Timestamp>()
})
const profileMeta = computed(() => profileMetaRef.value)

let unsubscribe = () => {}

interface seenThread {
  threadid: string,
  timestamp: firebase.firestore.Timestamp
}

function parseSeen (seenArray:Array<seenThread>) {
  const newMap = new Map<string, firebase.firestore.Timestamp>()
  if (seenArray) {
    seenArray.forEach((seenThread) => {
      newMap.set(seenThread.threadid, seenThread.timestamp)
    })
  }
  return newMap
}

function fetchProfile (uid:string|null) {
  unsubscribe()
  if (!uid) {
    profileRef.value = { nick: '', tagline: '' }
  } else {
    const db = firebase.firestore()
    const fbProfileRef = db.collection('profiles').doc(uid)
    unsubscribe = fbProfileRef.onSnapshot((snap) => {
      if (!snap.exists) {
        profileRef.value = { nick: '', tagline: '' }
        return
      }
      profileRef.value = {
        nick: snap.data()?.nick || '',
        tagline: snap.data()?.tagline || '',
        photoURL: snap.data()?.photoURL || ''
      }
      profileMetaRef.value = {
        lovedThreads: snap.data()?.lovedThreads,
        seenThreads: parseSeen(snap.data()?.seenThreads),
        pelilautaLang: snap.data()?.pelilautaLang,
        allThreadsSeenSince: snap.data()?.allThreadsSeenSince
      }
    })

    fetchAssets(uid)

    // Load the user notification inbox after the user has changed
    useInbox()
  }
}

async function createProfile (): Promise<void> {
  console.warn('Initializing a new profile for the user')
  const db = firebase.firestore()
  const fbProfileRef = db.collection('profiles').doc(firebase.auth().currentUser?.uid)
  return fbProfileRef.get().then((doc) => {
    const nick = firebase.auth().currentUser?.displayName || firebase.auth().currentUser?.email?.split('@')[0]
    let pelilautaLang = navigator.languages ? navigator.languages[0] : navigator.language
    let photoURL = firebase.auth().currentUser?.photoURL
    if (doc.exists && !doc.data()?.nick) {
      pelilautaLang = doc.data()?.pelilautaLang || pelilautaLang
      photoURL = doc.data()?.photoURL || photoURL
      return fbProfileRef.update({ nick: nick, pelilautaLang: pelilautaLang, photoURL: photoURL })
    }
    if (!doc.exists) return fbProfileRef.set({ nick: nick, pelilautaLang: pelilautaLang, photoURL: photoURL })
  })
}

async function updateProfile (fields: Record<string, string>): Promise<void> {
  if (fields.nick || fields.tagline) {
    const db = firebase.firestore()
    const { uid } = useAuthState()
    const fbProfileRef = db.collection('profiles').doc(uid.value)
    return fbProfileRef.update(fields)
  }
}

function hasSeen (threadid: string, flowTime?: firebase.firestore.Timestamp|null): boolean {
  if (!flowTime) return false
  if (profileMeta.value.allThreadsSeenSince && profileMeta.value.allThreadsSeenSince.seconds >= flowTime.seconds) return true
  if (profileMeta.value.seenThreads) {
    return ((profileMeta.value.seenThreads.get(threadid) || 0) >= flowTime)
  }
  return false
}

function seenFrom (threadid: string): number {
  return (
    profileMeta.value.seenThreads.get(threadid)?.seconds ||
    profileMeta.value.allThreadsSeenSince?.seconds ||
    new Date().getTime() / 1000)
}

async function markAllThreadsRead (): Promise<void> {
  const db = firebase.firestore()
  const { uid } = useAuthState()
  const fbProfileRef = db.collection('profiles').doc(uid.value)
  return fbProfileRef.update({ allThreadsSeenSince: firebase.firestore.FieldValue.serverTimestamp() })
}

async function stampSeen (threadid:string, flowTime?:firebase.firestore.Timestamp|number): Promise<void> {
  const { user } = useAuth()
  if (!user.value.uid) {
    console.error('Trying to manipulate user data with no uid', user.value)
    return
  }
  // Stamp the same thread seen from notifications
  setSeen(threadid)

  const db = firebase.firestore()
  const profileRef = db.collection('profiles').doc(user.value.uid)
  return profileRef.get().then((doc) => {
    let arr = doc.data()?.seenThreads ? doc.data()?.seenThreads : new Array<seenThread>()
    arr = arr.filter((val:seenThread) => (val.threadid !== threadid))
    arr.push({ threadid: threadid, timestamp: flowTime || firebase.firestore.FieldValue.serverTimestamp() })
    return profileRef.update({ seenThreads: arr })
  })
}

let _init = false
function init () {
  if (_init) return
  _init = true

  const { uid } = useAuthState()
  fetchProfile(uid.value)
  watch(uid, fetchProfile)
}

async function switchLang (lang: string): Promise<void> {
  const { uid } = useAuthState()
  const db = firebase.firestore()
  const profileRef = db.collection('profiles').doc(uid.value)
  return profileRef.update({
    pelilautaLang: lang
  })
}

export function useProfile (): {
    isAdmin: ComputedRef<boolean>
    profile: ComputedRef<PublicProfile>
    profileMeta: ComputedRef<ProfileMeta>
    updateProfile: (fields: Record<string, string>) => Promise<void>
    createProfile: () => Promise<void>
    markAllThreadsRead: () => Promise<void>
    hasSeen: (threadid: string, flowTime?: firebase.firestore.Timestamp|null) => boolean
    stampSeen: (threadid:string, flowTime?:firebase.firestore.Timestamp|number) => Promise<void>
    seenFrom: (threadid: string) => number
    switchLang: (lang: string) => Promise<void>
    uploadAsset: (file:File) => Promise<string>
    } {
  init()
  const { uploadAsset } = useAssets()
  return { isAdmin, profile, profileMeta, updateProfile, createProfile, markAllThreadsRead, hasSeen, stampSeen, switchLang, uploadAsset, seenFrom }
}
