import { computed, ComputedRef, ref, Ref } from 'vue'

import { createSite } from '.'

const localMembers:Ref<string[]> = ref([])
const members = computed(() => (localMembers.value))

const localOwners:Ref<string[]> = ref([])
const owners = computed(() => (localOwners.value))

export function subscribeTo (siteid: string): void {
  console.log('needs a breaking rewrite', siteid)
}

export function useMembers (): {
  members: ComputedRef<string[]>,
  owners: ComputedRef<string[]>
  } {
  createSite()
  return { members, owners }
}
