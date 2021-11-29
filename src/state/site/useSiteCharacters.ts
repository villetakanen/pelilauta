import { watch, ref, computed, ComputedRef, reactive } from 'vue'
import { collection, getFirestore, onSnapshot, query, where } from '@firebase/firestore'
import { Character } from '../characters/Character'
import { useSite } from '.'
import { logDebug, logEvent } from '@/utils/eventLogger'

let _init = false
let _siteid = ''
const state = reactive({
  loading: false
})
let unsubscribe:CallableFunction|undefined

const localCharacters = ref<Map<string, Character>>(new Map())
const characters = computed(() => new Map(localCharacters.value))

function subscribe (siteid:string) {
  logDebug('useSiteCharacters.subscribe', { siteid })
  _siteid = siteid
  state.loading = true
  if (unsubscribe) unsubscribe()
  localCharacters.value = new Map()

  // Player characters are identifiable by the user.uid
  const characterCollectionQuery = query(
    collection(getFirestore(), 'characters'),
    where('site', '==', siteid)
  )

  unsubscribe = onSnapshot(characterCollectionQuery, (snapshot) => {
    snapshot.docChanges().forEach((docChange) => {
      if (docChange.type === 'removed') {
        localCharacters.value.delete(docChange.doc.id)
      } else {
        localCharacters.value.set(docChange.doc.id, new Character(docChange.doc.id, docChange.doc.data()))
      }
    })
    state.loading = false
    logEvent('FirestoreSubscription', { type: 'usite.characters', count: localCharacters.value.size })
  })
}

export function useSiteCharacters (): {
    characters: ComputedRef<Map<string, Character>>
    } {
  logDebug('useSiteCharacters')
  const { site } = useSite()
  if (!_init) {
    _init = true
    watch(site, (site) => {
      if (site.id === _siteid) return
      subscribe(site.id)
    }, { immediate: true })
  }
  return { characters }
}
