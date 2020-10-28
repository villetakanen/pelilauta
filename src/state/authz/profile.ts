import { useAuthz } from '@/lib/authz'
import { useMeta } from '@/lib/meta'
import { computed, ComputedRef } from 'vue'

const isAdmin: ComputedRef<boolean> = computed(() => {
  const { uid } = useAuthz()
  const { isAdmin } = useMeta()
  return isAdmin(uid.value)
})

let _init = false
const init = () => {
  if (_init) return
  _init = true
}

export function useProfile (): { isAdmin: ComputedRef<boolean> } {
  init()
  return { isAdmin }
}
