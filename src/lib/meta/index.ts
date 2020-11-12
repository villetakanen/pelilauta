import { ref, computed, ComputedRef } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { useAuthz } from '../authz'

export interface Topic {
  slug: string;
  title: string;
  description?: string;
  icon?: string;
}

export interface MenuItem {
  text: string;
  to?: string;
  action?: () => void
  icon?: string;
  admin?: boolean;
}

interface MetaState {
  admins: string[];
  topics: Topic[];
  frozen: string[];
}

const state = ref({
  admins: [],
  topics: [],
  frozen: []
} as MetaState)

const isAdmin = (uid: string) => {
  return state.value.admins.includes(uid)
}

const isFrozen = (uid: string): boolean => {
  // Admins can not be frozen: this is just for sanity
  if (isAdmin(uid)) return false
  if (!state.value.frozen) return false
  return state.value.frozen.includes(uid)
}

const showStreamActions = computed((): boolean => {
  const { uid } = useAuthz()
  return !isFrozen(uid.value)
})

const topics = computed((): Topic[] => (state.value.topics))

let init = false
function _init () {
  if (init) return
  init = true

  // fetch online versions
  const db = firebase.firestore()
  const metaRef = db.collection('meta').doc('pelilauta')
  metaRef.onSnapshot((doc) => {
    if (doc.exists) {
      state.value.admins = doc.data()?.admins
      state.value.topics = doc.data()?.topics
      state.value.frozen = doc.data()?.frozen
    }
  })
}

export function useMeta (): {
  isAdmin: (uid: string) => boolean;
  isFrozen: (uid: string) => boolean;
  topics: ComputedRef<Topic[]>;
  showStreamActions: ComputedRef<boolean>;
  } {
  _init()
  return { isAdmin, isFrozen, topics, showStreamActions }
}
