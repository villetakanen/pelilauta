import { doc, getFirestore, onSnapshot } from '@firebase/firestore'
import { computed, ComputedRef, reactive, ref } from 'vue'
import { Stream, ThreadClass } from '../threads/threads'

const localStreams = ref(new Array<Stream>())
const streams = computed(() => (localStreams.value))
const frozenState = ref(new Array<string>())
const frozen = computed(() => (frozenState.value))
const adminsState = ref(new Array<string>())
const admins = computed(() => (adminsState.value))

export interface SiteTheme {
  name: string
  icon: string
  id: string
}

const appMeta = reactive({
  siteThemes: new Array<SiteTheme[]>()

})

const siteThemes = computed(() => appMeta.siteThemes)

let _init = false
function init () {
  if (_init) return
  _init = true

  const metaRef = doc(getFirestore(), 'meta', 'pelilauta')

  onSnapshot(metaRef, (metaDoc) => {
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
    appMeta.siteThemes = metaDoc.data()?.siteThemes || []
  })
}

const DEFAULT_STREAM:Stream = {
  slug: '-',
  name: '',
  icon: '',
  description: '',
  count: 0,
  order: -1
}

function getTopic (thread: ThreadClass): Stream {
  return streams.value.find((topic) => (topic.slug === thread.topic)) || DEFAULT_STREAM
}

export function useMeta (): {
    admins: ComputedRef<Array<string>>
    frozen: ComputedRef<Array<string>>
    streams: ComputedRef<Array<Stream>>
    siteThemes: ComputedRef<Array<SiteTheme[]>>
    getTopic: (thread: ThreadClass) => Stream
    } {
  init()
  return { admins, frozen, streams, getTopic, siteThemes }
}
