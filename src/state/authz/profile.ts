import { useAuthz } from '@/lib/authz'
import { useMeta } from '@/lib/meta'
import { computed, ComputedRef } from 'vue'

export interface SSOData {
  displayName: string
}

const isAdmin: ComputedRef<boolean> = computed(() => {
  const { uid } = useAuthz()
  const { isAdmin } = useMeta()
  return isAdmin(uid.value)
})

const sSOData = computed(() => ({ displayName: 'not implemented yet' }))

let _init = false
const init = () => {
  if (_init) return
  _init = true
}

export function useProfile (): { isAdmin: ComputedRef<boolean>; sSOData: ComputedRef<SSOData> } {
  init()
  return { isAdmin, sSOData }
}
