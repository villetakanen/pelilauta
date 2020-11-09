import { computed, ref } from 'vue'
import { useAuthz } from '../../lib/authz'

const anonymousSession = ref(false)
const isAnonymous = computed(() => {
  const { isAuthz } = useAuthz()
  return isAuthz.value === false && anonymousSession.value
})

export function useAuthState () {
  return { anonymousSession, isAnonymous }
}
