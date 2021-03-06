
import { ref, computed, ComputedRef } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { PublicProfile } from '@/state/authz'
import { useMeta } from '../meta'

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
  const db = firebase.firestore()
  const profilesRef = db.collection('profiles')
  profilesRef.onSnapshot((changes) => {
    changes.docChanges().forEach((change) => {
      const doc = change.doc
      if (doc.exists) {
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
  nonFrozenAuthors: ComputedRef<PublicProfile[]>;
  } {
  _init()
  return { authors, getAuthor, nonFrozenAuthors }
}
