import { ComputedRef, ref, Ref, computed } from 'vue'
import { PlayerCharacter } from '@/utils/firestoreInterfaces'
import { useSite } from '../site'
import { addDoc, collection, doc, DocumentData, getFirestore, onSnapshot, updateDoc, query, where, getDoc } from '@firebase/firestore'
import { useAuth } from '../authz'

const localPlayerCharacters = ref(new Map<string, PlayerCharacter>())
const playerCharacters = computed(() => localPlayerCharacters.value)
const characters = ref(new Map<string, PlayerCharacter>())

let init = false
let unsubscribe = () => {}

async function addPlayerCharacter (type: string) {
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
}

export function toPlayerCharacter (data?:DocumentData):PlayerCharacter {
  return {
    name: data?.name ?? 'N.N.',
    player: data?.player ?? 'Anonymous',
    htmlContent: data?.htmlContent ?? '',
    deltaContent: data?.htmlContent ?? ''
  }
}

function subscribeCharacters () {
  console.debug('Subscribing the users character database')
  const { user } = useAuth()
  characters.value = new Map<string, PlayerCharacter>()

  // We subsribe to all characters with primary player is current user
  unsubscribe()
  const characterCollectionQuery = query(
    collection(getFirestore(), 'characters'),
    where('player', '==', user.value.uid)
  )

  unsubscribe = onSnapshot(characterCollectionQuery, (snapshot) => {
    snapshot.docChanges().forEach((docChange) => {
      console.debug('got', docChange.doc.data())
      if (docChange.type === 'removed') {
        playerCharacters.value.delete(docChange.doc.id)
      } else {
        playerCharacters.value.set(docChange.doc.id, toPlayerCharacter(docChange.doc.data()))
      }
    })
  })
}

const localCharacter = ref<PlayerCharacter|undefined|null>(undefined)
const character = computed(() => localCharacter.value)

async function fetchPlayerCharacter (id: string): Promise<void> {
  localCharacter.value = undefined
  if (localPlayerCharacters.value.has(id)) {
    localCharacter.value = localPlayerCharacters.value.get(id)
  } else {
    const c = await getDoc(
      doc(
        getFirestore(),
        'characters',
        id
      )
    )
    if (c.exists()) localCharacter.value = toPlayerCharacter(c.data())
    else localCharacter.value = null
  }
}

export function useCharacters (): {
    addPlayerCharacter: (type: string) => Promise<string>
    characters: Ref<Map<string, PlayerCharacter>>,
    playerCharacters: ComputedRef<Map<string, PlayerCharacter>>,
    updatePlayerCharacter: (char:PlayerCharacter) => Promise<void>,
    fetchPlayerCharacter: (id: string) => Promise<void>,
    character: ComputedRef<PlayerCharacter|unknown|null>
    } {
  if (!init) {
    init = true
    subscribeCharacters()
  }
  return { addPlayerCharacter, characters, updatePlayerCharacter, playerCharacters, fetchPlayerCharacter, character }
}
