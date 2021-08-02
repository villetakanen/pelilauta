import { ref } from 'vue'
import { PlayerCharacter } from '@/utils/firestoreInterfaces'
import { useSite } from '../site'

const characters = ref(new Map<string, PlayerCharacter>())

function addPlayerCharacter (type: string) {
  const { site } = useSite()
  console.debug('adding a character to', site.value.id, site.value.name)
}

export function useCharacters () {
  return { characters }
}
