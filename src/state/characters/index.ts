import { ref } from 'vue'
import { PlayerCharacter } from '@/utils/firestoreInterfaces'

const characters = ref(new Map<string, PlayerCharacter>())

export function useCharacters () {
  return { characters }
}
