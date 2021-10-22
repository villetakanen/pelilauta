
import { ref, computed, ComputedRef } from 'vue'
import { PublicProfile } from '@/state/authz'
import { useMeta } from '../meta'
import { collection, getFirestore, onSnapshot, DocumentData, getDoc, doc } from '@firebase/firestore'

const authorsState = ref(new Array<PublicProfile>())
const authors = computed(() => authorsState.value)
const nonFrozenAuthors = computed(() => {
  const { frozen } = useMeta()
  return authorsState.value.filter((a) => (!frozen.value.includes(a.uid || '')))
})

let init = false
function _init () {
  if (init) return
  init = true

  // fetch all authors
  const profilesRef = collection(getFirestore(), 'profiles')
  onSnapshot(profilesRef, (changes) => {
    changes.docChanges().forEach((change) => {
      const doc = change.doc
      if (doc.exists()) {
        const author: PublicProfile = {
          uid: doc.id,
          nick: doc.data()?.nick,
          photoURL: doc.data()?.photoURL,
          tagline: doc.data()?.tagline
        }
        authors.value.push(author)
      }
    })
  })
}

export class AuthorClass {
  readonly uid:string
  readonly nick:string

  constructor (uid: string, data?:DocumentData) {
    this.uid = uid
    this.nick = data?.nick || 'N.N.'
  }
}
const publicAuthorList = ref(new Map<string, AuthorClass>())

async function fetchAuthor (uid: string): Promise<AuthorClass> {
  console.debug('fetchAuthor', uid)
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
  authors: ComputedRef<PublicProfile[]>;
  getAuthor: (uid: string) => PublicProfile;
  fetchAuthor: (uid: string) => Promise<AuthorClass>
  nonFrozenAuthors: ComputedRef<PublicProfile[]>;
  } {
  _init()
  return { authors, getAuthor, nonFrozenAuthors, fetchAuthor }
}
