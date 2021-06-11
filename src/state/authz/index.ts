import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import { useProfile, PublicProfile, ProfileMeta } from './profile'
import { useAuthState } from './state'
import { useAssets } from './assets'
import { reactive } from 'vue'

const authState = reactive({
  session: false,
  anonymous: true,
  user: {
    uid: ''
  }
})

function onAuthStateChanged (user: firebase.User|null) {
  if (!user || user.isAnonymous) {
    console.debug('state.authz.onAuthStateChanged', 'anonymous')
    authState.anonymous = true
    authState.user = {
      uid: ''
    }
  } else {
    console.debug('state.authz.onAuthStateChanged', user.displayName, user.uid)
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

export {
  ProfileMeta,
  PublicProfile,
  createAuth,
  useAuthState,
  useAssets,
  useProfile
}
