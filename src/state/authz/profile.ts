import { computed, ComputedRef, Ref, ref } from 'vue'
import { fetchAssets, useAssets } from './assets'
import { setSeen, useInbox } from '@/state/inbox'
import { useAuth } from '.'
import { doc, getDoc, getFirestore, onSnapshot, serverTimestamp, setDoc, Timestamp, updateDoc } from '@firebase/firestore'
import { getAuth } from '@firebase/auth'
import { logEvent } from '@/utils/eventLogger'

export interface PublicProfile {
  uid: string
  nick: string
  tagline?: string
  photoURL?: string
}

export interface ProfileMeta {
  lovedThreads: Array<string>
  seenThreads: Map<string, Timestamp>
  pelilautaLang?: string
  allThreadsSeenSince?: Timestamp
}

const profileRef:Ref<PublicProfile> = ref({
  uid: '',
  nick: '',
  tagline: '',
  frozen: false
})
const profile = computed(() => profileRef.value)

const profileMetaRef:Ref<ProfileMeta> = ref({
  lovedThreads: new Array<string>(),
  seenThreads: new Map<string, Timestamp>()
})
const profileMeta = computed(() => profileMetaRef.value)

let unsubscribe = () => {}

interface seenThread {
  threadid: string,
  timestamp: Timestamp
}

function parseSeen (seenArray:Array<seenThread>) {
  const newMap = new Map<string, Timestamp>()
  if (seenArray) {
    seenArray.forEach((seenThread) => {
      newMap.set(seenThread.threadid, seenThread.timestamp)
    })
  }
  return newMap
}

function fetchProfile (uid:string|null) {
  logEvent('deprecated fetchProfile subscription')
  unsubscribe()
  if (!uid) {
    profileRef.value = { uid: '', nick: '', tagline: '' }
  } else {
    const fbProfileRef = doc(getFirestore(), 'profiles', uid)
    unsubscribe = onSnapshot(fbProfileRef, (snap) => {
      if (!snap.exists) {
        profileRef.value = { uid: '', nick: '', tagline: '' }
        return
      }
      profileRef.value = {
        uid: uid,
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
  const db = getFirestore()
  const authUid = getAuth().currentUser?.uid ?? ''
  if (!authUid) throw new Error('Trying to create a profile for non existing user')
  const fbProfileRef = doc(db, 'profiles', '')
  return getDoc(fbProfileRef).then((profileDoc) => {
    const currentUser = getAuth().currentUser
    const nick = currentUser?.displayName ?? currentUser?.email?.split('@')[0] ?? 'Nomen Nix'
    let pelilautaLang = navigator.languages ? navigator.languages[0] : navigator.language
    let photoURL = currentUser?.photoURL
    if (profileDoc.exists() && !profileDoc.data()?.nick) {
      pelilautaLang = profileDoc.data()?.pelilautaLang || pelilautaLang
      photoURL = profileDoc.data()?.photoURL || photoURL
      return updateDoc(
        fbProfileRef,
        { nick: nick, pelilautaLang: pelilautaLang, photoURL: photoURL }
      )
    } else {
      return setDoc(
        fbProfileRef,
        { nick: nick, pelilautaLang: pelilautaLang, photoURL: photoURL }
      )
    }
  })
}

async function updateProfile (fields: Record<string, string>): Promise<void> {
  if (fields.nick || fields.tagline) {
    const { user } = useAuth()
    console.debug('updating profile for ', user)
    const d = doc(getFirestore(), 'profiles', user.value.uid)
    const p = await getDoc(d)
    if (!p.exists()) return setDoc(d, { ...fields })
    return updateDoc(
      d,
      { ...fields }
    )
  }
}

function hasSeen (threadid: string, flowTime?: Timestamp|null): boolean {
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
  const { user } = useAuth()
  return updateDoc(
    doc(getFirestore(), 'profiles', user.value.uid),
    { allThreadsSeenSince: serverTimestamp() }
  )
}

async function stampSeen (threadid:string, flowTime?:Timestamp|number): Promise<void> {
  const { user } = useAuth()
  if (!user.value.uid) {
    console.error('Trying to manipulate user data with no uid', user.value)
    return
  }
  // Stamp the same thread seen from notifications
  setSeen(threadid)

  const profileRef = doc(getFirestore(), 'profiles', user.value.uid)
  return getDoc(profileRef).then((doc) => {
    let arr = doc.data()?.seenThreads ? doc.data()?.seenThreads : new Array<seenThread>()
    arr = arr.filter((val:seenThread) => (val.threadid !== threadid))
    arr.push({ threadid: threadid, timestamp: flowTime || serverTimestamp() })
    return updateDoc(profileRef, { seenThreads: arr })
  })
}

async function switchLang (lang: string): Promise<void> {
  const { user } = useAuth()
  return updateDoc(
    doc(getFirestore(), 'profiles', user.value.uid),
    {
      pelilautaLang: lang
    }
  )
}

let stateUid = ''

export function useProfile (uid?: string): {
    profile: ComputedRef<PublicProfile>
    profileMeta: ComputedRef<ProfileMeta>
    updateProfile: (fields: Record<string, string>) => Promise<void>
    createProfile: () => Promise<void>
    markAllThreadsRead: () => Promise<void>
    hasSeen: (threadid: string, flowTime?: Timestamp|null) => boolean
    stampSeen: (threadid:string, flowTime?: Timestamp|number) => Promise<void>
    seenFrom: (threadid: string) => number
    switchLang: (lang: string) => Promise<void>
    uploadAsset: (file:File) => Promise<string>
    } {
  if (uid && uid !== stateUid) {
    fetchProfile(uid)
    stateUid = uid
  }
  const { uploadAsset } = useAssets()
  return { profile, profileMeta, updateProfile, createProfile, markAllThreadsRead, hasSeen, stampSeen, switchLang, uploadAsset, seenFrom }
}
