import { doc, getFirestore, increment, runTransaction, Transaction } from '@firebase/firestore'

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
  const db = getFirestore()
  const threadRef = doc(db, 'stream', threadid)
  const profileRef = doc(db, 'profiles', uid)

  return runTransaction(db, (transaction: Transaction) => {
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
        lovedCount: increment(1)
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
export async function unloveThread (uid: string, threadid: string): Promise<void> {
  const db = getFirestore()
  const threadRef = doc(db, 'stream', threadid)
  const profileRef = doc(db, 'profiles', uid)

  return runTransaction(db, (transaction: Transaction) => {
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
        lovedCount: increment(-1)
      })
    })
  })
}
