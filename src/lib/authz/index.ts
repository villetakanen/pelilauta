import { ref, computed } from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

const state = ref({
  isAuthz: false,
  profile: {
    nick: '',
    photoURL: ''
  }
})
const isAuthz = computed(() => (state.value.isAuthz))
const profile = computed(() => (state.value.profile))
let unsubscribe = () => {}

function onAuthStateChanged (user: firebase.User|null): void {
  unsubscribe()
  if (typeof user === 'undefined' || user === null) {
    state.value.isAuthz = false
    return
  }
  state.value.isAuthz = true
  const db = firebase.firestore()
  const profileRef = db.collection('profiles').doc(user.uid)
  unsubscribe = profileRef.onSnapshot((doc) => {
    state.value.profile.nick = doc.data()?.nick
    state.value.profile.photoURL = doc.data()?.photoURL
  })
}

export function useAuthz () {
  return { onAuthStateChanged, isAuthz, profile }
}
