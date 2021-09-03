import { ref, Ref, watch } from 'vue'
import { PlayerCharacter } from '@/utils/firestoreInterfaces'
import { useSite } from '../site'
import { addDoc, collection, doc, DocumentData, getFirestore, onSnapshot, updateDoc } from '@firebase/firestore'

const characters = ref(new Map<string, PlayerCharacter>())

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
  console.debug('updating', site.value.id, char.id, char.name)
  if (site.value.usePlayers) {
    return updateDoc(
      doc(getFirestore(), 'sites', site.value.id, 'characters', char.id),
      { ...char }
    )
  } else {
    throw new Error('can not add characters to a game with no player functions')
  }
}

let init = false
let siteid = ''
let unsubscribe = () => {}

export function toPlayerCharacter (pcid?:string, data?:DocumentData):PlayerCharacter {
  return {
    id: pcid ?? '',
    name: data?.name ?? 'N.N.',
    description: data?.description ?? '',
    playerid: data?.playerid ?? '',
    type: data?.type ?? 'default'
  }
}

function subscribeCharacters () {
  unsubscribe()
  characters.value = new Map<string, PlayerCharacter>()
  const characterCollection = collection(getFirestore(), 'sites', siteid, 'characters')
  unsubscribe = onSnapshot(characterCollection, (snapshot) => {
    snapshot.docChanges().forEach((docChange) => {
      if (docChange.type === 'removed') {
        characters.value.delete(docChange.doc.id)
      } else {
        characters.value.set(docChange.doc.id, toPlayerCharacter(docChange.doc.id, docChange.doc.data()))
      }
    })
  })
}

export function useCharacters (): {
    addPlayerCharacter: (type: string) => Promise<string>
    characters: Ref<Map<string, PlayerCharacter>>
    updatePlayerCharacter: (char:PlayerCharacter) => Promise<void>
    } {
  if (!init) {
    init = true
    const { site } = useSite()
    watch(site, (val) => {
      if (val.id !== siteid) {
        siteid = val.id
        subscribeCharacters()
      }
    }, {
      immediate: true
    })
  }
  return { addPlayerCharacter, characters, updatePlayerCharacter }
}
