
import { ref, computed, ComputedRef } from 'vue'
import { PublicProfile } from '@/state/authz'
import { useMeta } from '../meta'
import { collection, getFirestore, onSnapshot, DocumentData, getDoc, doc } from '@firebase/firestore'
import { logEvent } from '@/utils/eventLogger'

const authors = computed(() => (Array.from(publicAuthorList.value.values())))
const nonFrozenAuthors = computed(() => {
  const { frozen } = useMeta()
  return authors.value.filter((a) => (!frozen.value.includes(a.uid || '')))
})

export class AuthorClass {
  readonly uid:string
  readonly nick:string
  readonly photoURL:string|undefined

  constructor (uid: string, data?:DocumentData) {
    this.uid = uid
    this.nick = data?.nick || 'N.N.'
    this.photoURL = data?.photoURL || undefined
  }
}
const publicAuthorList = ref(new Map<string, AuthorClass>())

async function fetchAuthor (uid: string): Promise<AuthorClass> {
  const cached = publicAuthorList.value.get(uid)
  if (cached) return cached

  const authorDoc = await getDoc(
    doc(
      getFirestore(),
      'profiles',
      uid
    )
  )

  if (authorDoc.exists()) {
    const ac = new AuthorClass(uid, authorDoc.data())
    publicAuthorList.value.set(uid, ac)
    return ac
  }

  return new AuthorClass('')
}

let authorsSubscribed = false

function subscribeToAuthors (): void {
  if (authorsSubscribed) return
  authorsSubscribed = true

  logEvent('subscribeToAuthors')

  onSnapshot(
    collection(getFirestore(), 'profiles'),
    (changes) => {
      changes.docChanges().forEach((change) => {
        if (change.type !== 'removed') {
          publicAuthorList.value.set(change.doc.id, new AuthorClass(change.doc.id, change.doc.data()))
        } else {
          publicAuthorList.value.delete(change.doc.id)
        }
      })
    }
  )
}

function getAuthor (uid: string): PublicProfile {
  const profile = authors.value.find((p) => (p.uid === uid))
  if (profile) return profile
  return {
    uid: 'anonymous',
    nick: 'anonymous',
    photoURL: ''
  }
}

export function useAuthors (): {
  authors: ComputedRef<AuthorClass[]>
  getAuthor: (uid: string) => PublicProfile
  fetchAuthor: (uid: string) => Promise<AuthorClass>
  nonFrozenAuthors: ComputedRef<PublicProfile[]>
  subscribeToAuthors: () => void
  } {
  return { authors, getAuthor, nonFrozenAuthors, fetchAuthor, subscribeToAuthors }
}
