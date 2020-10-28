
// import { computed, ref, ComputedRef } from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'

export async function updateReplyContent (author: string, threadid: string, replyid: string, contents: string): Promise<void> {
  firebase.analytics().logEvent('updateComment', { author: author })

  const db = firebase.firestore()
  const threadRef = db.collection('stream').doc(threadid)
  const replyRef = threadRef.collection('comments').doc(replyid)

  return replyRef.update({
    content: contents,
    updatedBy: author,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  /* return db.runTransaction(((transaction: firebase.firestore.Transaction) => {
    return transaction.get(replyRef).then((replyDoc) => {
      if (!replyDoc.exists) {
        throw new Error('Document does not exist!')
      }
      transaction.update(replyRef, )
      transaction.update
    })
  }) */
}
