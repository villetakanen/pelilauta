import { useProfile, PublicProfile, ProfileMeta } from './profile'
// import { useAuthState } from './state'
import { useAssets } from './assets'
import { computed, ComputedRef, reactive } from 'vue'
import { useMeta } from '../meta'
import { onAuthStateChanged, getAuth, User } from '@firebase/auth'
import { doc, getFirestore, onSnapshot, deleteDoc } from '@firebase/firestore'

/**
 * A reactive object, that holds all state internals for auth
 */
const authState = reactive({
  loginComplete: false,
  profileDeletionInProgress: false,
  missingProfileData: false,
  anonymous: false,
  displayName: '',
  user: {
    uid: ''
  }
})

const user = computed(() => (authState.user))
const registrationIncomplete = computed(() => (!authState.profileDeletionInProgress && authState.missingProfileData))
const displayName = computed(() => (authState.displayName))
const frozen = computed(() => {
  const { frozen: frozenAuthors } = useMeta()
  return frozenAuthors.value.includes(authState.user.uid)
})
const loginComplete = computed(() => (authState.loginComplete))

// Show member only tools of the App to the user
const showMemberTools = computed(() => {
  if (showAdminTools.value) return true
  if (frozen.value) return false
  return !authState.anonymous
})

const showAdminTools = computed(() => {
  const { admins } = useMeta()
  return admins.value.includes(authState.user.uid)
})

const anonymousSession = computed(() => (authState.anonymous))

let unsubscribeProfile:CallableFunction|undefined

function fetchProfile () {
  console.debug('fetchProfile from firestore')
  if (unsubscribeProfile) unsubscribeProfile()

  const profileRef = doc(getFirestore(), 'profiles', authState.user.uid)
  unsubscribeProfile = onSnapshot(profileRef, (snap) => {
    if (snap.exists()) {
      if (!snap.data()?.nick) {
        console.debug('profile is missing a nickname: please display the registration dialog')
        authState.missingProfileData = true
      } else {
        authState.missingProfileData = false

        // @TODO refactor profile fetching to this module
        useProfile(authState.user.uid)
      }
    } else {
      console.debug('user does not have a profile entry: lets create that through the registration dialog')
      authState.missingProfileData = true
    }
  })
}

function processAuthStateChanged (user: User|null) {
  authState.loginComplete = false
  if (!user || user.isAnonymous) {
    console.debug('onAuthStateChanged', 'anonymous')
    authState.missingProfileData = false
    authState.anonymous = true
    authState.user = {
      uid: ''
    }
    authState.loginComplete = true
  } else {
    console.debug('onAuthStateChanged', user.displayName, user.uid)
    authState.anonymous = false
    authState.displayName = user.displayName ?? 'anonymous'
    authState.user = {
      uid: user.uid
    }
    authState.loginComplete = true
    fetchProfile()
  }
}

/**
 * Initializes the auth state, fires all hooks for auth state retrieval
 */
function createAuth (): void {
  onAuthStateChanged(getAuth(), (user) => {
    processAuthStateChanged(user)
  })
}

async function createProfile (nickname?: string): Promise<void> {
  const user = getAuth().currentUser
  const { updateProfile } = useProfile()
  return updateProfile({
    nick: nickname ?? user?.displayName ?? '',
    photoURL: user?.photoURL ?? '/assets/void.svg'
  })
}

async function eraseProfile (): Promise<void> {
  authState.profileDeletionInProgress = true
  await deleteDoc(
    doc(
      getFirestore(),
      'profiles',
      user.value.uid
    )
  )
  getAuth().signOut()
  authState.profileDeletionInProgress = false
}

function useAuth (): {
    user: ComputedRef<{ uid: string }>,
    registrationIncomplete: ComputedRef<boolean>,
    displayName: ComputedRef<string>,
    frozen: ComputedRef<boolean>,
    anonymousSession: ComputedRef<boolean>,
    showMemberTools: ComputedRef<boolean>
    showAdminTools: ComputedRef<boolean>
    loginComplete: ComputedRef<boolean>
    eraseProfile: () => Promise<void>,
    createProfile: (nick: string) => Promise<void>} {
  return { user, registrationIncomplete, displayName, frozen, showMemberTools, anonymousSession, showAdminTools, eraseProfile, createProfile, loginComplete }
}

export {
  ProfileMeta,
  PublicProfile,
  createAuth,
  useAuth,
  useAssets,
  useProfile
}
