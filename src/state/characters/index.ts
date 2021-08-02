import { ref, Ref } from 'vue'
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

export function useCharacters (): {
    addPlayerCharacter: (type: string) => Promise<string>
    characters: Ref<Map<string, PlayerCharacter>>
    } {
  return { addPlayerCharacter, characters }
}
