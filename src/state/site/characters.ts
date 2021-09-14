import { PlayerCharacter } from '@/utils/firestoreInterfaces'
import { ref, computed, ComputedRef } from 'vue'
import { getFirestore, onSnapshot, query, collection, where } from '@firebase/firestore'
import { toPlayerCharacter } from '@/state/characters'

const localCharacters = ref(new Map<string, PlayerCharacter>())
const siteCharacters = computed(() => localCharacters.value)

let localSiteId = ''
let unsubscribe = () => {}

export async function subscribeCharacters (siteid: string): Promise<void> {
  if (localSiteId === siteid) return

  localSiteId = siteid
  unsubscribe()

  const siteCharactersQuery = query(collection(getFirestore(), 'characters'), where('siteid', '==', siteid))

  unsubscribe = await onSnapshot(siteCharactersQuery, (snap) => {
    snap.docChanges().forEach((docChange) => {
      if (docChange.type === 'removed') {
        localCharacters.value.delete(docChange.doc.id)
      } else {
        const pc = toPlayerCharacter(docChange.doc.data())
        localCharacters.value.set(docChange.doc.id, pc)
      }
    })
  })
}

export function useSiteCharacters (): { siteCharacters: ComputedRef<Map<string, PlayerCharacter>> } {
  return { siteCharacters }
}
