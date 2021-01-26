/**
 * DEPRECATED: If you need to change this file, please move the functionality to /composables, /state, or /utils
 */
import { ref, computed } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { useAuthState } from '@/state/authz'

const state = ref({
  isAuthz: false,
  missingProfile: false,
  uid: '',
  lang: 'en'
})

const isAuthz = computed(() => (state.value.isAuthz))
const uid = computed(() => (state.value.uid))
const missingProfile = computed(() => (state.value.missingProfile))
const lang = computed(() => (state.value.lang))
let unsubscribe = () => {}

interface seenThread {
  threadid: string,
  timestamp: firebase.firestore.Timestamp
}

/*
function parseSeen (seenArray:Array<seenThread>) {
  const newMap = new Map<string, firebase.firestore.Timestamp>()
  seenArray.forEach((seenThread) => {
    newMap.set(seenThread.threadid, seenThread.timestamp)
  })
  profile.value.seenThreads = newMap
}
*/

function subToProfile (uid: string): void {
  const db = firebase.firestore()
  const profileRef = db.collection('profiles').doc(uid)
  unsubscribe = profileRef.onSnapshot((doc) => {
    if (doc.exists) {
      state.value.missingProfile = false
      if (doc.data()?.pelilautaLang) state.value.lang = doc.data()?.pelilautaLang
      else state.value.lang = 'en'
    } else {
      state.value.missingProfile = true
    }
  })
}

function onAuthStateChanged (user: firebase.User|null): void {
  if (user === null) {
    const { anonymousSession } = useAuthState()
    anonymousSession.value = true
  }
  if (user && user.uid === state.value.uid) return
  unsubscribe()
  if (typeof user === 'undefined' || user === null) {
    state.value.isAuthz = false
    state.value.uid = ''
    state.value.missingProfile = false
    return
  }

  state.value.isAuthz = true
  state.value.uid = user.uid
  subToProfile(user.uid)
}

function switchLang (lang: string) {
  const db = firebase.firestore()
  const profileRef = db.collection('profiles').doc(uid.value)
  profileRef.update({
    pelilautaLang: lang
  })
}

/* function stampSeen (id: string, flowTime: firebase.firestore.Timestamp) {
  const db = firebase.firestore()
  const profileRef = db.collection('profiles').doc(uid.value)
  profileRef.get().then((doc) => {
    const arr = doc.data()?.seenThreads ? doc.data()?.seenThreads : new Array<seenThread>()
    arr.push({ threadid: id, timestamp: flowTime })
    profileRef.update({ seenThreads: arr })
  })
} */

export function useAuthz () {
  return { onAuthStateChanged, isAuthz, uid, missingProfile, lang, switchLang }
}
