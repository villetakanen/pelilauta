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
export function loveThread (uid: string, threadid: string): void {
  console.log('threads/loveThread', uid, threadid)

  const db = firebase.firestore()
  const threadRef = db.collection('stream').doc(threadid)
  const profileRef = db.collection('profiles').doc(uid)

  db.runTransaction((transaction: firebase.firestore.Transaction) => {
    return transaction.get(profileRef).then((profile) => {
      if (!profile.exists) {
        throw new Error('state/loveThread, trying to love by a non existing user' + uid)
      }

      const lovesArr = new Array<string>()
      const dataArr = profile.data()?.lovedThreads
      if (dataArr) {
        if ((dataArr as Array<string>).includes(threadid)) {
          throw new Error('Can not love a tread one already loves')
        }
        (dataArr as Array<string>).forEach((loved: string) => { lovesArr.push(loved) })
      }
      lovesArr.push(threadid)
      transaction.update(profileRef, { lovedThreads: lovesArr })

      transaction.update(threadRef, {
        lovedCount: firebase.firestore.FieldValue.increment(1)
      })
    })
  })
}

/**
 * See loveThread for more info, undoes it
 *
 * @param uid Firebase user UID, with a valid profile data in /database/profiles/{uid}
 * @param threadid The id of a Stream Thread, found in /database/stream/{threadid}
 */
export function unloveThread (uid: string, threadid: string): void {
  console.log('threads/unloveThread', uid, threadid)

  const db = firebase.firestore()
  const threadRef = db.collection('stream').doc(threadid)
  const profileRef = db.collection('profiles').doc(uid)

  db.runTransaction((transaction: firebase.firestore.Transaction) => {
    return transaction.get(profileRef).then((profile) => {
      if (!profile.exists) {
        throw new Error('state/loveThread, trying to love by a non existing user' + uid)
      }

      const lovesArr = new Array<string>()
      const dataArr = profile.data()?.lovedThreads
      if (dataArr) {
        if (!(dataArr as Array<string>).includes(threadid)) {
          throw new Error('Can not de-love a tread one not-loves')
        }
        (dataArr as Array<string>).forEach((loved: string) => { if (loved !== threadid) lovesArr.push(loved) })
      }
      transaction.update(profileRef, { lovedThreads: lovesArr })

      transaction.update(threadRef, {
        lovedCount: firebase.firestore.FieldValue.increment(-1)
      })
    })
  })
}
