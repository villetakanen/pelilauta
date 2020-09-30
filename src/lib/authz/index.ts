import { ref, computed } from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

const state = ref({
  isAuthz: false,
  uid: '',
  profile: {
    nick: '',
    photoURL: ''
  }
})
const isAuthz = computed(() => (state.value.isAuthz))
const profile = computed(() => (state.value.profile))
const uid = computed(() => (state.value.uid))
let unsubscribe = () => {}

function onAuthStateChanged (user: firebase.User|null): void {
  if (user && user.uid === state.value.uid) return
  unsubscribe()
  if (typeof user === 'undefined' || user === null) {
    state.value.isAuthz = false
    state.value.uid = ''
    return
  }
  state.value.isAuthz = true
  state.value.uid = user.uid
  const db = firebase.firestore()
  const profileRef = db.collection('profiles').doc(user.uid)
  unsubscribe = profileRef.onSnapshot((doc) => {
    state.value.profile.nick = doc.data()?.nick
    state.value.profile.photoURL = doc.data()?.photoURL
  })
}

export function useAuthz () {
  return { onAuthStateChanged, isAuthz, profile, uid }
}
