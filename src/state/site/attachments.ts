import { computed, ComputedRef, ref } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'

export interface Attachment {
  url: string,
  name: string,
  site?: string
  thread?: string
}

const cachedFilelisting = ref(new Array<[string, string]>()) // @deprecated
const cachedAttachments = ref(new Map<string, Attachment>())
const files = computed(() => (cachedFilelisting.value)) // @deprecated
const attachments = computed(() => (cachedAttachments.value))

export function refreshStorage (siteid: string): void {
  console.log('fetching files for', siteid)

  // Flush the attachment listings from state
  cachedFilelisting.value = new Array<[string, string]>()
  cachedAttachments.value = new Map<string, Attachment>()

  const storage = firebase.storage()
  const listRef = storage.ref().child(siteid)
  // Find all the prefixes and items.
  // Note, this only fetches files on the site storage root
  listRef.listAll().then((res) => {
    res.items.forEach((itemRef) => {
      console.log('itemRef:', itemRef)
      // All the items under listRef.
      itemRef.getDownloadURL().then((url) => {
        cachedFilelisting.value.push([itemRef.name, url])
        cachedAttachments.value.set(itemRef.name, { name: itemRef.name, url: url, site: siteid })
      })
    })
  }).catch((error) => {
    console.log(error)
  })
}

export function useFiles (): { files: ComputedRef<[string, string][]>; attachments: ComputedRef<Map<string, Attachment>>; } {
  return { files, attachments }
}
