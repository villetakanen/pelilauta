import { computed, ref, Ref, ComputedRef, WritableComputedRef } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import { useMeta } from '@/state/meta'
import { useAuthz } from '../../lib/authz'

const anonymousSession = ref(true)
const isAnonymous = computed(() => (anonymousSession.value))

const isAuthz = computed(() => {
  const { isAuthz } = useAuthz()
  return isAuthz.value
})

const isAdmin = computed(() => {
  if (isAnonymous.value) return false
  // Admins are listed on meta-data, lets see if our uid is in
  // the admin table
  const { admins } = useMeta()
  return admins.value.includes(uid.value)
})

const authUid = ref('')

const uid = computed({
  get: () => (authUid.value),
  set: (val:string|null) => {
    if (!val) authUid.value = ''
    else authUid.value = val
  }
})

function flushAuth () {
  console.log('flushAuth')
  anonymousSession.value = true
  authUid.value = ''
}

function loginAs (user: firebase.User) {
  anonymousSession.value = user.isAnonymous
  // ./profile.ts watches this change!
  authUid.value = user.uid
}

function onAuthStateChanged (user: firebase.User|null): void {
  if (user === null) flushAuth()
  else loginAs(user)
}

export function useAuthState (): {
  anonymousSession: Ref<boolean>;
  isAnonymous: ComputedRef<boolean>;
  isAuthz: ComputedRef<boolean>;
  uid: WritableComputedRef<string>;
  isAdmin: ComputedRef<boolean>;
  onAuthStateChanged: (user: firebase.User|null) => void;
  } {
  return { anonymousSession, isAnonymous, uid, isAdmin, onAuthStateChanged, isAuthz }
}
