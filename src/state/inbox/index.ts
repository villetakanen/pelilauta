
import { computed, ref, ComputedRef } from 'vue'
import { useAuthState } from '../authz'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'

const cachedMessages = ref(new Array<Notification>())
const inboxMessages = computed(() => (cachedMessages.value))

let unsubscribe = () => {}

function subscribeToInbox () {
  const { uid } = useAuthState()
  if (uid.value === _uid) return
  _uid = uid.value

  console.debug('subscribing to inbox contents')

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
        cachedMessages.value = new Array<Notification>()
        notifications.forEach((row) => {
          console.debug('pushing', row)
          cachedMessages.value.push(row as Notification)
        })
      }
    }
  })
}

let _uid = ''
export function useInbox (): {
    inboxMessages: ComputedRef<Notification[]>
    } {
  subscribeToInbox()
  return { inboxMessages }
}
