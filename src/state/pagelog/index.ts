import { computed, ComputedRef, ref } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'

interface PageLogEntry {
  name: string,
  siteid: string,
  pageid: string,
  creator: string,
  changetime: firebase.firestore.Timestamp,
}

const localRecent = ref(new Array<PageLogEntry>())
const recent = computed(() => (localRecent.value))
const lastFlowtime = computed(() => (recent.value.length > 0 ? recent.value[0]?.changetime?.seconds : 0))
let unsubscribe = () => {}

function addToRecent (entry: PageLogEntry) {
  localRecent.value.push(entry)
}

function fetchPagelog (): Array<PageLogEntry> {
  const log = new Array<PageLogEntry>()

  const db = firebase.firestore()
  const pageLogRef = db.collection('pagelog')
  pageLogRef.orderBy('changetime', 'desc').where('silent', '==', false).limit(30).get().then((snapshot) => {
    snapshot.forEach((doc) => {
      log.push(doc.data() as PageLogEntry)
    })
  })
  return log
}

function subscribeToRecent () {
  unsubscribe()
  const db = firebase.firestore()
  const pageLogRef = db.collection('pagelog')
  unsubscribe = pageLogRef.orderBy('changetime', 'desc').where('silent', '==', false).limit(3).onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      console.debug('got change', change.doc.id)
      addToRecent(change.doc.data() as PageLogEntry)
    })
  })
}

let init = false
export function usePagelog ():
  {
    recent: ComputedRef<Array<PageLogEntry>>
    lastFlowtime: ComputedRef<number>
    fetchPagelog: () => Array<PageLogEntry>
    } {
  if (!init) {
    subscribeToRecent()
    init = true
  }
  return { recent, lastFlowtime, fetchPagelog }
}
