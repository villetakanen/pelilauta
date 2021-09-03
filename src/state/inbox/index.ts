
import { computed, ref, ComputedRef } from 'vue'
import { useAuth } from '../authz'
import { NotificationMessage } from '@/utils/firestoreInterfaces'
import { doc, getFirestore, onSnapshot, setDoc, updateDoc } from '@firebase/firestore'

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
  const { user } = useAuth()
  updateDoc(
    doc(getFirestore(), 'inbox', user.value.uid),
    { notifications: cachedMessages.value }
  )
}

export async function setSeen (notificationSourceID: string): Promise<void> {
  const messageIndex = cachedMessages.value.findIndex((nm) => (nm.source.id === notificationSourceID))
  markRedByIndex(messageIndex)
}

let unsubscribe = () => {}

function subscribeToInbox () {
  const { user } = useAuth()
  if (user.value.uid === _uid) return
  _uid = user.value.uid

  unsubscribe()
  const db = getFirestore()
  const inboxRef = doc(db, 'inbox', user.value.uid)
  unsubscribe = onSnapshot(inboxRef, (snap) => {
    // inbox does not exist, lets create it
    if (!snap.exists) {
      setDoc(
        doc(db, 'inbox', user.value.uid),
        {
          owner: user.value.uid
        }
      )
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
