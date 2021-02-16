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

export function useAuthz () {
  return { onAuthStateChanged, isAuthz, uid, missingProfile, lang, switchLang }
}
