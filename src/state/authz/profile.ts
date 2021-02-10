import { computed, ComputedRef, Ref, ref, watch } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import { useMeta } from '@/lib/meta'
import { useAuthState } from './state'

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
  const { isAdmin } = useMeta()
  return isAdmin(uid.value)
})

const profileRef:Ref<PublicProfile> = ref({
  nick: '',
  tagline: ''
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
  }
}

async function createProfile (): Promise<void> {
  const db = firebase.firestore()
  const fbProfileRef = db.collection('profiles').doc(firebase.auth().currentUser?.uid)
  return fbProfileRef.get().then((doc) => {
    if (!doc.exists) {
      return fbProfileRef.set({
        nick: firebase.auth().currentUser?.displayName,
        pelilautaLang: navigator.languages ? navigator.languages[0] : navigator.language,
        photoURL: firebase.auth().currentUser?.photoURL
      })
    }
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
  /* console.log(profileMeta.value.allThreadsSeenSince?.seconds,
    flowTime.seconds,
    (profileMeta.value.allThreadsSeenSince?.seconds || 0) >= flowTime.seconds
  ) */
  if (profileMeta.value.allThreadsSeenSince && profileMeta.value.allThreadsSeenSince.seconds >= flowTime.seconds) return true
  if (profileMeta.value.seenThreads) {
    return ((profileMeta.value.seenThreads.get(threadid) || 0) >= flowTime)
  }
  return false
}

async function markAllThreadsRead (): Promise<void> {
  console.log('markAllThreadRead')
  const db = firebase.firestore()
  const { uid } = useAuthState()
  const fbProfileRef = db.collection('profiles').doc(uid.value)
  return fbProfileRef.update({ allThreadsSeenSince: firebase.firestore.FieldValue.serverTimestamp() })
}

async function stampSeen (threadid:string, flowTime?:firebase.firestore.Timestamp|number): Promise<void> {
  const { uid } = useAuthState()
  const db = firebase.firestore()
  const profileRef = db.collection('profiles').doc(uid.value)
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

export function useProfile (): {
    isAdmin: ComputedRef<boolean>
    profile: ComputedRef<PublicProfile>
    profileMeta: ComputedRef<ProfileMeta>
    updateProfile: (fields: Record<string, string>) => Promise<void>
    createProfile: () => Promise<void>
    markAllThreadsRead: () => Promise<void>
    hasSeen: (threadid: string, flowTime?: firebase.firestore.Timestamp|null) => boolean
    stampSeen: (threadid:string, flowTime?:firebase.firestore.Timestamp|number) => Promise<void>
    } {
  init()
  return { isAdmin, profile, profileMeta, updateProfile, createProfile, markAllThreadsRead, hasSeen, stampSeen }
}
