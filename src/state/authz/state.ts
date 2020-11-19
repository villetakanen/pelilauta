import { useMeta } from '@/lib/meta'
import { computed, ref, Ref, ComputedRef, WritableComputedRef } from 'vue'
import { useAuthz } from '../../lib/authz'

const anonymousSession = ref(false)

const isAnonymous = computed(() => {
  const { isAuthz } = useAuthz()
  return isAuthz.value === false && anonymousSession.value
})

const isAdmin = computed(() => {
  const { isAdmin: inAdmins } = useMeta()
  return inAdmins(uid.value)
})

const authUid = ref('')

const uid = computed({
  get: () => (authUid.value),
  set: (val:string|null) => {
    if (!val) authUid.value = ''
    else authUid.value = val
  }
})

export function useAuthState (): {
  anonymousSession: Ref<boolean>;
  isAnonymous: ComputedRef<boolean>;
  uid: WritableComputedRef<string>;
  isAdmin: ComputedRef<boolean>;
  } {
  return { anonymousSession, isAnonymous, uid, isAdmin }
}
