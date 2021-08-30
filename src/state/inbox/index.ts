
import { computed, ref, ComputedRef } from 'vue'
import { useAuthState } from '../authz'
import { NotificationMessage } from '@/utils/firestoreInterfaces'

const cachedMessages = ref(new Array<NotificationMessage>())
const inboxMessages = computed(() => (cachedMessages.value))

const unreadCount = computed(() => {
  let count = 0
  inboxMessages.value.forEach((n) => {
    if (n.meta.new) count++
  })
  return count
})

function markRedByIndex (index: number): void {
  if (!cachedMessages.value[index]) return
  cachedMessages.value[index].meta.new = false
  const db = firebase.firestore()
  const { uid } = useAuthState()
  const inboxRef = db.collection('inbox').doc(uid.value)
  inboxRef.update({ notifications: cachedMessages.value })
}

export async function setSeen (notificationSourceID: string): Promise<void> {
  const messageIndex = cachedMessages.value.findIndex((nm) => (nm.source.id === notificationSourceID))
  markRedByIndex(messageIndex)
}

let unsubscribe = () => {}

function subscribeToInbox () {
  const { uid } = useAuthState()
  if (uid.value === _uid) return
  _uid = uid.value

  unsubscribe()
  const db = firebase.firestore()
  const inboxRef = db.collection('inbox').doc(uid.value)
  unsubscribe = inboxRef.onSnapshot((snap) => {
    // inbox does not exist, lets create it
    if (!snap.exists) {
      db.collection('inbox').doc(uid.value).set({
        owner: uid.value
      })
    } else {
      const notifications = snap.data()?.notifications
      if (Array.isArray(notifications)) {
        cachedMessages.value = new Array<NotificationMessage>()
        notifications.forEach((row) => {
          cachedMessages.value.push(row as NotificationMessage)
        })
        cachedMessages.value.sort((a, b) => {
          if (a.meta.new && !b.meta.new) return -1
          if (!a.meta.new && b.meta.new) return 1
          return 0
        })
      }
    }
  })
}

let _uid = ''
export function useInbox (): {
    inboxMessages: ComputedRef<NotificationMessage[]>,
    unreadCount: ComputedRef<number>,
    markRedByIndex: CallableFunction
    } {
  subscribeToInbox()
  return { inboxMessages, unreadCount, markRedByIndex }
}
