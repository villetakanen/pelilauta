import { computed, ComputedRef, Ref, ref, watch } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import { useMeta } from '@/lib/meta'
import { useAuthState } from './state'

export interface SSOData {
  displayName: string
}

export interface PublicProfile {
  nick: string
  tagline: string
  photoURL?: string
}

export interface ProfileMeta {
  lovedThreads: Array<string>;
  seenThreads: Map<string, firebase.firestore.Timestamp>;
}

const isAdmin: ComputedRef<boolean> = computed(() => {
  const { uid } = useAuthState()
  const { isAdmin } = useMeta()
  return isAdmin(uid.value)
})

const sSOData = computed(() => ({ displayName: 'not implemented yet' }))

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

function fetchProfile (uid:string|null) {
  console.log('fetchProfile', uid)
  unsubscribe()
  if (!uid) {
    profileRef.value = { nick: '', tagline: '' }
  } else {
    const db = firebase.firestore()
    const fbProfileRef = db.collection('profiles').doc(uid)
    unsubscribe = fbProfileRef.onSnapshot((snap) => {
      if (!snap.exists) throw new Error('trying to subscribe to a non existing profile')
      profileRef.value = {
        nick: snap.data()?.nick || '',
        tagline: snap.data()?.tagline || '',
        photoURL: snap.data()?.photoURL || ''
      }
      profileMetaRef.value = {
        lovedThreads: snap.data()?.lovedThreads,
        seenThreads: snap.data()?.seenThreads
      }
    })
  }
}

async function updateProfile (fields: Record<string, string>): Promise<void> {
  if (fields.nick || fields.tagline) {
    const db = firebase.firestore()
    const { uid } = useAuthState()
    const fbProfileRef = db.collection('profiles').doc(uid.value)
    return fbProfileRef.update(fields)
  }
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
    isAdmin: ComputedRef<boolean>;
    sSOData: ComputedRef<SSOData>;
    profile: ComputedRef<PublicProfile>;
    profileMeta: ComputedRef<ProfileMeta>;
    updateProfile: (fields: Record<string, string>) => Promise<void>
    } {
  init()
  return { isAdmin, sSOData, profile, profileMeta, updateProfile }
}
