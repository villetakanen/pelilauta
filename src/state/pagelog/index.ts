import { computed, ComputedRef, ref } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'

export interface PageLogEntry {
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
  if (localRecent.value.length > 2) {
    let found = false
    localRecent.value.forEach((old, index) => {
      if (old.pageid === entry.pageid && old.siteid === entry.siteid) {
        localRecent.value[index] = entry
        found = true
      }
    })
    if (!found) {
      localRecent.value.pop()
      localRecent.value.reverse()
      localRecent.value.push(entry)
      localRecent.value.reverse()
    }
  } else {
    localRecent.value.push(entry)
  }
}

async function fetchPagelog (): Promise<Array<PageLogEntry>> {
  const log = new Array<PageLogEntry>()

  const db = firebase.firestore()
  const pageLogRef = db.collection('pagelog')
  await pageLogRef.orderBy('changetime', 'desc').where('silent', '==', false).limit(30).get().then((snapshot) => {
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
      addToRecent(change.doc.data() as PageLogEntry)
    })
  })
}

let init = false
export function usePagelog ():
  {
    recent: ComputedRef<Array<PageLogEntry>>
    lastFlowtime: ComputedRef<number>
    fetchPagelog: () => Promise<Array<PageLogEntry>>
    } {
  if (!init) {
    subscribeToRecent()
    init = true
  }
  return { recent, lastFlowtime, fetchPagelog }
}
