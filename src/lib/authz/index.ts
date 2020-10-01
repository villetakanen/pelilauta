import { ref, computed } from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

const state = ref({
  isAuthz: false,
  missingProfile: false,
  uid: '',
  profile: {
    nick: '',
    photoURL: ''
  }
})
const isAuthz = computed(() => (state.value.isAuthz))
const profile = computed(() => (state.value.profile))
const uid = computed(() => (state.value.uid))
const missingProfile = computed(() => (state.value.missingProfile))
let unsubscribe = () => {}

function onAuthStateChanged (user: firebase.User|null): void {
  console.log('onAuthStateChanged', user?.displayName)
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
  const db = firebase.firestore()
  const profileRef = db.collection('profiles').doc(user.uid)
  console.log('onAuthStateChanged', 'fetching data')
  unsubscribe = profileRef.onSnapshot((doc) => {
    if (doc.exists) {
      state.value.missingProfile = false
      state.value.profile.nick = doc.data()?.nick
      state.value.profile.photoURL = doc.data()?.photoURL
    } else {
      state.value.missingProfile = true
    }
  })
}

export function useAuthz () {
  return { onAuthStateChanged, isAuthz, profile, uid, missingProfile }
}
