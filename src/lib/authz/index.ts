import { ref, computed } from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { useRouter } from 'vue-router'

const state = ref({
  isAuthz: false,
  ssoInfo: {
    displayName: '',
    photoUrl: '',
    email: '',
    provider: ''
  },
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
const ssoInfo = computed(() => (state.value.ssoInfo))
let unsubscribe = () => {}

function subToProfile (uid: string): void {
  const db = firebase.firestore()
  const profileRef = db.collection('profiles').doc(uid)
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

function onAuthStateChanged (user: firebase.User|null): void {
  if (user && user.uid === state.value.uid) return
  unsubscribe()
  if (typeof user === 'undefined' || user === null) {
    state.value.isAuthz = false
    state.value.uid = ''
    state.value.missingProfile = false
    return
  }

  state.value.ssoInfo.displayName = user.displayName as string
  state.value.ssoInfo.photoUrl = user.photoURL as string
  state.value.ssoInfo.email = user.email as string
  state.value.ssoInfo.provider = user.providerData[0]?.providerId as string

  state.value.isAuthz = true
  state.value.uid = user.uid
  subToProfile(user.uid)
}

function logout (): void {
  const router = useRouter()
  firebase.auth().signOut().then(() => {
    router.push('/')
  })
}

function createProfile (): void {
  const db = firebase.firestore()
  const profileRef = db.collection('profiles').doc(uid.value)
  profileRef.set({
    nick: state.value.ssoInfo.displayName,
    photoURL: state.value.ssoInfo.photoUrl
  }).then(() => {
    subToProfile(uid.value)
  })
}

export function useAuthz () {
  return { onAuthStateChanged, isAuthz, profile, uid, missingProfile, ssoInfo, logout, createProfile }
}
