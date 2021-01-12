import { computed, ComputedRef, ref } from 'vue'

export interface SnackMessage {
  topic: string,
  message?: string,
  code?: string
  action?: CallableFunction
}

const snackStack = ref(new Array<SnackMessage>())

const snackStackLength = computed(() => (snackStack.value.length))

function pushSnack (message: SnackMessage) {
  snackStack.value.push(message)
  console.log('snacks', snackStack.value)
}

function popSnack (): SnackMessage|undefined {
  return snackStack.value.pop()
}

export function useSnack (): { pushSnack(message: SnackMessage): void, popSnack (): SnackMessage|undefined, snackStackLength: ComputedRef } {
  return { pushSnack, popSnack, snackStackLength }
}
