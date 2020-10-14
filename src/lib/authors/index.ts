
import { ref, computed, ComputedRef } from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { Profile } from '../stream'

const authorsState = ref(new Array<Profile>())
const authors = computed(() => authorsState.value)

let init = false
function _init () {
  if (init) return
  init = true

  // fetch all authors
  const db = firebase.firestore()
  const metaRef = db.collection('meta').doc('pelilauta')
  metaRef.onSnapshot((doc) => {
    if (doc.exists) {
      const author: Profile = {
        uid: doc.id,
        nick: doc.data()?.nick,
        photoURL: doc.data()?.photoURL
      }
      authors.value.push(author)
    }
  })
}

function getAuthor (uid: string): Profile {
  const profile = authors.value.find((p) => (p.uid === uid))
  if (profile) return profile
  return {
    uid: 'anonymous',
    nick: 'anonymous',
    photoURL: ''
  }
}

export function useAuthors (): {
  authors: ComputedRef<Profile[]>;
  getAuthor: (uid: string) => Profile;
  } {
  _init()
  return { authors, getAuthor }
}
