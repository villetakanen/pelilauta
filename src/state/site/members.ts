import { computed, ComputedRef, ref, Ref, watch } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import { useRoute } from 'vue-router'

const localMembers:Ref<string[]> = ref([])
const members = computed(() => (localMembers.value))

const localOwners:Ref<string[]> = ref([])
const owners = computed(() => (localOwners.value))

const unsubscribe = () => {}

function subscribeTo (siteid:string|null|undefined) {
  console.log('members.ts: subscribeTo', siteid)
  if (!siteid) {
    unsubscribe()
    return
  }
  const db = firebase.firestore()
  const siteRef = db.collection('sites').doc(siteid)
  const ownersRef = siteRef.collection('owners')
  const membersRef = siteRef.collection('members')
  ownersRef.onSnapshot((changes) => {
    changes.docChanges().forEach((change) => {
      if (change.type === 'removed') {
        localOwners.value = localOwners.value.filter((val) => (val !== change.doc.id))
        localMembers.value = localMembers.value.filter((val) => (val !== change.doc.id))
      } else {
        localOwners.value.push(change.doc.id)
        localMembers.value.push(change.doc.id)
      }
    })
  })
  membersRef.onSnapshot((changes) => {
    changes.docChanges().forEach((change) => {
      if (change.type === 'removed') {
        localMembers.value = localMembers.value.filter((val) => (val !== change.doc.id))
      } else {
        localMembers.value.push(change.doc.id)
      }
    })
    console.log('members updated to', localMembers.value)
  })
}

let _init = false
function init () {
  if (_init) return
  _init = true

  firebase.analytics().logEvent('Init members')

  const route = useRoute()
  subscribeTo(Array.isArray(route.params.siteid) ? route.params.siteid[0] : route.params.siteid)
  watch(route, () => {
    subscribeTo(Array.isArray(route.params.siteid) ? route.params.siteid[0] : route.params.siteid)
  })
}

export function useMembers (): {
  members: ComputedRef<string[]>,
  owners: ComputedRef<string[]>
  } {
  init()
  return { members, owners }
}
