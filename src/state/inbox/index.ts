
import { computed, ref, ComputedRef } from 'vue'

const cachedMessages = ref(new Array<string>())
const inboxMessages = computed(() => (cachedMessages.value))

export function useInbox (): {
    inboxMessages: ComputedRef<string[]>
    } {
  return { inboxMessages }
}
