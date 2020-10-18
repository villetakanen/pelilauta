import * as firebase from 'firebase/app'
import 'firebase/firestore'

/**
 * Given   I am logged in
 *   And   Have a profile
 *   And   A post is not loved by me
 *         (and, thus) The post exists
 *  When   I click love on a post
 *  Then   // The thread is loved visually
 *   And   The thread loved count++
 *   And   The thread is added to my loved threads
 *
 * @param uid Firebase user UID, with a valid profile data in /database/profiles/{uid}
 * @param threadid The id of a Stream Thread, found in /database/stream/{threadid}
 */
export async function loveThread (uid: string, threadid: string): Promise<void> {
  console.log('threads/loveThread', uid, threadid)

  const db = firebase.firestore()
  const batch = db.batch()

  const profileReactionsRef = db.collection('profiles').doc(uid).collection('reactions').doc()
  batch.set(profileReactionsRef, {
    uid: uid,
    reaction: 'love',
    target: 'thread',
    threadid: threadid
  })

  const threadRef = db.collection('stream').doc(threadid)
  batch.update(threadRef, {
    lovedCount: firebase.firestore.FieldValue.increment(1)
  })

  const threadReactionsRef = db.collection('stream').doc(threadid).collection('reactions').doc()
  batch.set(threadReactionsRef, {
    uid: uid,
    reaction: 'love',
    target: 'thread',
    threadid: threadid
  })

  return batch.commit()
}
