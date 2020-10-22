import * as firebase from 'firebase/app'
import 'firebase/firestore'

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
 */
export function loveReply (uid: string, threadid: string, replyid: string): void {
  const db = firebase.firestore()
  const replyRef = db.collection('stream').doc(threadid).collection('comments').doc(replyid)

  db.runTransaction((transaction: firebase.firestore.Transaction) => {
    return transaction.get(replyRef).then((reply) => {
      if (!reply.exists) {
        throw new Error('state/loveReply, trying to love by a non existing reply' + threadid + "/" + replyid)
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

      const reactionsRef = db.collection('profiles').doc(uid).collection('reactions').doc()

      transaction.update(reactionsRef, { uid: uid, thread: threadid, reply: replyid, type: 'love', target: 'thread' })
    })
  })

  /* db.runTransaction((transaction: firebase.firestore.Transaction) => {
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
  }) */
}

/**
 * See loveThread for more info, undoes it
 *
 * @param uid Firebase user UID, with a valid profile data in /database/profiles/{uid}
 * @param threadid The id of a Stream Thread, found in /database/stream/{threadid}
 */
export function unloveThread (uid: string, threadid: string): void {
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
