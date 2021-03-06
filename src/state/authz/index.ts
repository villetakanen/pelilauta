import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/analytics'
import { useProfile, PublicProfile, ProfileMeta } from './profile'
import { useAuthState } from './state'
import { useAssets } from './assets'
import { computed, ComputedRef, reactive } from 'vue'
import { useMeta } from '../meta'

/**
 * A reactive object, that holds all state internals for auth
 */
const authState = reactive({
  missingProfileData: false,
  anonymous: false,
  admin: false,
  displayName: '',
  user: {
    uid: ''
  }
})

const user = computed(() => (authState.user))
const registrationIncomplete = computed(() => (authState.missingProfileData))
const displayName = computed(() => (authState.displayName))
const frozen = computed(() => {
  const { frozen: frozenAuthors } = useMeta()
  return frozenAuthors.value.includes(authState.user.uid)
})
const showMemberTools = computed(() => {
  if (authState.admin) return true
  if (frozen.value) return false
  return !authState.anonymous
})
const anonymousSession = computed(() => (authState.anonymous))

let unsubscribeProfile:CallableFunction|undefined

function fetchProfile () {
  if (unsubscribeProfile) unsubscribeProfile()

  const db = firebase.firestore()
  const profileRef = db.collection('profiles').doc(authState.user.uid)
  unsubscribeProfile = profileRef.onSnapshot((snap) => {
    if (snap.exists) {
      if (!snap.data()?.nick) {
        console.debug('profile is missing a nickname: please display the registration dialog')
        authState.missingProfileData = true
      } else {
        authState.missingProfileData = false
      }
    } else {
      console.debug('user does not have a profile entry: lets create that through the registration dialog')
      authState.missingProfileData = true
    }
  })
}

function onAuthStateChanged (user: firebase.User|null) {
  if (!user || user.isAnonymous) {
    console.debug('onAuthStateChanged', 'anonymous')
    authState.missingProfileData = false
    authState.anonymous = true
    authState.admin = false
    authState.user = {
      uid: ''
    }
  } else {
    console.debug('onAuthStateChanged', user.displayName, user.uid)
    authState.anonymous = false
    authState.admin = false
    authState.displayName = user.displayName ?? 'anonymous'
    authState.user = {
      uid: user.uid
    }
    fetchProfile()
  }
}

/**
 * Initializes the auth state, fires all hooks for auth state retrieval
 */
function createAuth (): void {
  firebase.auth().onAuthStateChanged((user) => {
    onAuthStateChanged(user)
  })
}

function useAuth (): {
    user: ComputedRef<{ uid: string }>,
    registrationIncomplete: ComputedRef<boolean>,
    displayName: ComputedRef<string>,
    frozen: ComputedRef<boolean>,
    anonymousSession: ComputedRef<boolean>,
    showMemberTools: ComputedRef<boolean>} {
  return { user, registrationIncomplete, displayName, frozen, showMemberTools, anonymousSession }
}

export {
  ProfileMeta,
  PublicProfile,
  createAuth,
  useAuth,
  useAuthState,
  useAssets,
  useProfile
}
