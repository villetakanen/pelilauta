import { computed, ComputedRef, ref } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'

const cachedFilelisting = ref(new Array<[string, string]>())
const files = computed(() => (cachedFilelisting.value))

export function refreshStorage (siteid: string): void {
  console.log('fetching files for', siteid)
  cachedFilelisting.value = new Array<[string, string]>()
  const storage = firebase.storage()
  const listRef = storage.ref().child(siteid)
  // Find all the prefixes and items.
  listRef.listAll().then((res) => {
    // res.prefixes.forEach(function(folderRef) {
    // All the prefixes under listRef.
    // You may call listAll() recursively on them.
    // })
    res.items.forEach((itemRef) => {
      // All the items under listRef.
      itemRef.getDownloadURL().then((url) => {
        cachedFilelisting.value.push([itemRef.name, url])
      })
    })
  }).catch((error) => {
    console.log(error)
  })
}

export function useFiles (): { files: ComputedRef<[string, string][]> } {
  return { files }
}
