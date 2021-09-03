import { getAnalytics, logEvent } from '@firebase/analytics'
import { doc, getDoc, getFirestore, runTransaction, Transaction } from '@firebase/firestore'

/**
 * Given   I am logged in
 *   And   Have a profile
 *   And   A reply is not loved by me
 *         (and, thus) The reply exists
 *  When   I click love on a reply
 *  Then   // The reply is loved visually
 *   And   The reply loved count++
 *   And   The reply is added to my reactions collection
 *
 * @param uid Firebase user UID, with a valid profile data in /database/profiles/{uid}
 * @param threadid The id of a Stream Thread, found in /database/stream/{threadid}
 * @param replyid the id of a reply, of the thread, found in /database/stream/{threadid}/comments/{replyid}
 */
export async function loveReply (uid: string, threadid: string, replyid: string): Promise<void> {
  const db = getFirestore()
  const replyRef = doc(db, 'stream', threadid, 'comments', replyid)

  logEvent(getAnalytics(), 'loveReply', { uid: uid, threadid: threadid, replyid: replyid })

  return runTransaction(db, (transaction: Transaction) => {
    return getDoc(replyRef).then((reply) => {
      if (!reply.exists) {
        throw new Error('state/loveReply, trying to love by a non existing reply' + threadid + '/' + replyid)
      }
      const lovesArr = new Array<string>()
      const lovesDataArr = reply.data()?.lovers
      if (lovesDataArr) {
        if ((lovesDataArr as Array<string>).includes(uid)) {
          throw new Error('Can not love a reply, one already loves')
        }
        (lovesDataArr as Array<string>).forEach((lover: string) => { lovesArr.push(lover) })
      }
      lovesArr.push(uid)
      transaction.update(replyRef, { lovesCount: lovesArr.length, lovers: lovesArr })

      const reactionsRef = doc(db, 'profiles', uid, 'reactions', replyid)

      transaction.set(reactionsRef, { uid: uid, thread: threadid, reply: replyid, type: 'love', target: 'thread' })
    })
  })
}

/**
 * Given   I am logged in
 *   And   Have a profile
 *   And   A reply is loved by me
 *         (and, thus) The reply exists
 *  When   I click love on a reply
 *  Then   // The reply is no longer loved visually
 *   And   The reply loved count--
 *   And   The reply is removed from my reactions collection
 *
 * @param uid Firebase user UID, with a valid profile data in /database/profiles/{uid}
 * @param threadid The id of a Stream Thread, found in /database/stream/{threadid}
 * @param replyid the id of a reply, of the thread, found in /database/stream/{threadid}/comments/{replyid}
 */
export async function unloveReply (uid: string, threadid: string, replyid: string): Promise<void> {
  const db = getFirestore()
  const replyRef = doc(db, 'stream', threadid, 'comments', replyid)

  logEvent(getAnalytics(), 'unloveReply', { uid: uid, threadid: threadid, replyid: replyid })

  return runTransaction(db, (transaction: Transaction) => {
    return getDoc(replyRef).then((reply) => {
      if (!reply.exists) {
        throw new Error('state/loveReply, trying to love by a non existing reply' + threadid + '/' + replyid)
      }
      const lovesArr = new Array<string>()
      const lovesDataArr = reply.data()?.lovers
      if (lovesDataArr) {
        if (!(lovesDataArr as Array<string>).includes(uid)) {
          throw new Error('Can not remove love from void')
        }
        (lovesDataArr as Array<string>).forEach((lover: string) => { if (lover !== uid) lovesArr.push(lover) })
      }
      transaction.update(replyRef, { lovesCount: lovesArr.length, lovers: lovesArr })

      const reactionsRef = doc(db, 'profiles', uid, 'reactions', replyid)

      transaction.delete(reactionsRef)
    })
  })
}
