import { computed, ComputedRef, ref } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { Stream } from '../threads/threads'

const localStreams = ref(new Array<Stream>())
const streams = computed(() => (localStreams.value))
const frozenState = ref(new Array<string>())
const frozen = computed(() => (frozenState.value))
const adminsState = ref(new Array<string>())
const admins = computed(() => (adminsState.value))

let _init = false
function init () {
  if (_init) return
  _init = true

  const db = firebase.firestore()
  const metaRef = db.collection('meta').doc('pelilauta')

  metaRef.onSnapshot((metaDoc) => {
    const s = new Array<Stream>()
    for (const key in metaDoc.data()?.streams) {
      s.push({
        slug: key,
        name: metaDoc.data()?.streams[key]?.name || key,
        description: metaDoc.data()?.streams[key]?.description || key,
        icon: metaDoc.data()?.streams[key]?.icon || 'none',
        count: metaDoc.data()?.streams[key]?.count || 0,
        order: metaDoc.data()?.streams[key]?.order || 0
      })
    }
    localStreams.value = s.sort((a, b) => {
      if (a.order === b.order) return a.name > b.name ? 1 : -1
      return a.order > b.order ? 1 : -1
    })
    frozenState.value = metaDoc.data()?.frozen || []
    adminsState.value = metaDoc.data()?.admins || []
  })
}

export function useMeta (): {
    admins: ComputedRef<Array<string>>
    frozen: ComputedRef<Array<string>>
    streams: ComputedRef<Array<Stream>>
    } {
  init()
  return { admins, frozen, streams }
}
