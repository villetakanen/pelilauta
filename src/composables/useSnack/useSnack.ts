import { computed, ComputedRef, ref, Ref } from 'vue'

export interface SnackMessage {
  topic: string,
  message?: string,
  code?: string
  action?: CallableFunction
}

const snackStack = ref(new Array<SnackMessage>())
const snackMessages = computed(() => (snackStack.value))

const snackStackLength = computed(() => (snackStack.value.length))

function pushSnack (message: SnackMessage) {
  snackStack.value.push(message)
  console.log('snacks', snackStack.value)
}

function popSnack (): SnackMessage|undefined {
  return snackStack.value.pop()
}

export function useSnack (): { pushSnack(message: SnackMessage): void, popSnack (): SnackMessage|undefined, snackStackLength: ComputedRef<number>, snackMessages: ComputedRef<Array<SnackMessage>> } {
  return { pushSnack, popSnack, snackStackLength, snackMessages }
}
