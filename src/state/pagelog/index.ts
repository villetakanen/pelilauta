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

function subscribeToRecent () {
  unsubscribe()
  const db = firebase.firestore()
  const pageLogRef = db.collection('pagelog')
  unsubscribe = pageLogRef.orderBy('changetime', 'desc').limit(3).onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      addToRecent(change.doc.data() as PageLogEntry)
    })
  })
}

let init = false
export function usePagelog ():
  {
    recent: ComputedRef<Array<PageLogEntry>>
    lastFlowtime: ComputedRef<number> } {
  if (!init) {
    subscribeToRecent()
    init = true
  }
  return { recent, lastFlowtime }
}
