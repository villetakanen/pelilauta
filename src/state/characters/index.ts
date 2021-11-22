import { ComputedRef, ref, computed, watch, reactive } from 'vue'
import { PlayerCharacter } from '@/utils/firestoreInterfaces'
import { addDoc, collection, doc, DocumentData, getFirestore, onSnapshot, updateDoc, query, where, getDoc } from '@firebase/firestore'
import { useAuth } from '../authz'
import { logDebug, logEvent } from '@/utils/eventLogger'
import { Character } from './Character'

const state = reactive({
  uid: '',
  loading: false
})
const loading = computed(() => state.loading)
const localCharacters = ref<Map<string, Character>>(new Map())
const characters = computed(() => new Map(localCharacters.value))

let _init = false
let unsubscribe:undefined|CallableFunction

/* async function addPlayerCharacter (type: string) {
  const { site } = useSite()
  console.debug('adding a character to', site.value.id, site.value.name, type)
  if (site.value.usePlayers) {
    return (await addDoc(
      collection(getFirestore(), 'sites', site.value.id, 'characters'),
      { type: type })
    ).id
  } else {
    throw new Error('can not add characters to a game with no player functions')
  }
}

async function createNewPlayerCharacter (fields: PartialPlayerCharacter) {
  const { user } = useAuth()
  return addDoc(
    collection(getFirestore(), 'characters'),
    {
      player: user.value.uid,
      ...fields
    }
  )
}

async function updatePlayerCharacterFields (id: string, fields: PartialPlayerCharacter) {
  return updateDoc(
    doc(getFirestore(), 'characters', id),
    { ...fields }
  )
}

async function updatePlayerCharacter (char:PlayerCharacter) {
  const { site } = useSite()
  console.debug('updating', site.value.id, '?', char.name)
  if (site.value.usePlayers) {
    return updateDoc(
      doc(getFirestore(), 'sites', site.value.id, 'characters', '?'),
      { ...char }
    )
  } else {
    throw new Error('can not add characters to a game with no player functions')
  }
} */

export function toPlayerCharacter (data?:DocumentData):PlayerCharacter {
  return {
    name: data?.name ?? 'N.N.',
    player: data?.player ?? 'Anonymous',
    htmlContent: data?.htmlContent ?? '',
    deltaContent: data?.deltaContent ?? '',
    siteid: data?.siteid ?? undefined
  }
}

function subscribeCharacters () {
  state.loading = true
  const { user } = useAuth()
  localCharacters.value = new Map<string, Character>()

  // As the logged in user changed, we need to unsubscribe from the old user
  if (unsubscribe) unsubscribe()

  // Player characters are identifiable by the user.uid
  const characterCollectionQuery = query(
    collection(getFirestore(), 'characters'),
    where('player', '==', user.value.uid)
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
    logEvent('FirestoreSubscription', { type: 'user.characters', count: localCharacters.value.size })
  })
}

export function useCharacters (): {
    // addPlayerCharacter: (type: string) => Promise<string>
    characters: ComputedRef<Map<string, Character>>,
    loading: ComputedRef<boolean>
    /* updatePlayerCharacter: (char:PlayerCharacter) => Promise<void>,
    fetchPlayerCharacter: (id: string) => Promise<void>,
    character: ComputedRef<PlayerCharacter|undefined|null>,
    updatePlayerCharacterFields: (id: string, fields: PartialPlayerCharacter) => Promise<void>,
    characterid: ComputedRef<string>,
    createNewPlayerCharacter: (fields: PartialPlayerCharacter) => Promise<DocumentData> */
    } {
  if (!_init) {
    _init = true
    const { user } = useAuth()
    watch(user, (user) => {
      if (user.uid !== state.uid) {
        logDebug('useCharacters effect', user)
        state.uid = user.uid
        subscribeCharacters()
      }
    }, { immediate: true })
  }
  return { loading, characters }
}
