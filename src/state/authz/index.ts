import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import { useProfile, PublicProfile, ProfileMeta } from './profile'
import { useAuthState } from './state'
import { useAssets } from './assets'
import { computed, ComputedRef, reactive } from 'vue'

const authState = reactive({
  missingProfileData: false,
  anonymous: true,
  admin: false,
  displayName: '',
  user: {
    uid: ''
  }
})
const user = computed(() => (authState.user))
const registrationIncomplete = computed(() => (authState.missingProfileData))
const displayName = computed(() => (authState.displayName))

let unsubscribeProfile:CallableFunction|undefined

function fetchProfile () {
  if (unsubscribeProfile) unsubscribeProfile()

  const db = firebase.firestore()
  const profileRef = db.collection('profiles').doc(authState.user.uid)
  unsubscribeProfile = profileRef.onSnapshot((snap) => {
    if (snap.exists) {
      // ...
      if (!snap.data()?.nick) {
        console.debug('profile is missing a nickname: please display the registration dialog')
        authState.missingProfileData = true
      }
    } else {
      console.debug('user does not have a profile entry: lets create that through the registration dialog')
      authState.missingProfileData = true
    }
  })
}

function onAuthStateChanged (user: firebase.User|null) {
  if (!user || user.isAnonymous) {
    console.debug('state.authz.onAuthStateChanged', 'anonymous')
    authState.missingProfileData = false
    authState.anonymous = true
    authState.admin = false
    authState.user = {
      uid: ''
    }
  } else {
    console.debug('state.authz.onAuthStateChanged', user.displayName, user.uid)
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

function useAuth (): { user: ComputedRef<{ uid: string }>, registrationIncomplete: ComputedRef<boolean>, displayName: ComputedRef<string> } {
  return { user, registrationIncomplete, displayName }
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
