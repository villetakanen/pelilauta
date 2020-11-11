import { computed, ref } from 'vue'
import { useAuthz } from '../../lib/authz'

const anonymousSession = ref(false)

const isAnonymous = computed(() => {
  const { isAuthz } = useAuthz()
  return isAuthz.value === false && anonymousSession.value
})

const authUid = ref('')

const uid = computed({
  get: () => (authUid.value),
  set: (val:string|null) => {
    if (!val) authUid.value = ''
    else authUid.value = val
  }
})

export function useAuthState () {
  return { anonymousSession, isAnonymous, uid }
}
