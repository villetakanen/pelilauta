import { ref, Ref, watch } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import { PlayerCharacter } from '@/utils/firestoreInterfaces'
import { useSite } from '../site'

const characters = ref(new Map<string, PlayerCharacter>())

async function addPlayerCharacter (type: string) {
  const { site } = useSite()
  console.debug('adding a character to', site.value.id, site.value.name)
  if (site.value.usePlayers) {
    const db = firebase.firestore()
    return (await db.collection('sites').doc(site.value.id).collection('characters').add({ type: type })).id
  } else {
    throw new Error('can not add characters to a game with no player functions')
  }
}
let init = false
let siteid = ''
let unsubscribe = () => {}

export function toPlayerCharacter (pcid?:string, data?:firebase.firestore.DocumentData):PlayerCharacter {
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
  const db = firebase.firestore()
  const characterCollection = db.collection('sites').doc(siteid).collection('characters')
  unsubscribe = characterCollection.onSnapshot((snapshot) => {
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
  return { addPlayerCharacter, characters }
}
