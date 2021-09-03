
// import { computed, ref, ComputedRef } from 'vue'
import { computed, ComputedRef, ref } from 'vue'
import { Reply } from '@/utils/firestoreInterfaces'
import { addDoc, collection, deleteDoc, doc, getFirestore, increment, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from '@firebase/firestore'
import { getAnalytics, logEvent } from '@firebase/analytics'

let parentThreadId = ''
let unsubscribe:CallableFunction|null = null
const repliesState = ref(new Map<string, Reply>())
const replies = computed(() => (repliesState.value))

export function subscribeToReplies (newId: string): void {
  if (parentThreadId === newId) return // return: no-op
  parentThreadId = newId
  repliesState.value = new Map<string, Reply>()
  if (unsubscribe) unsubscribe()
  const q = query(collection(getFirestore(), 'stream', newId, 'comments'), orderBy('created', 'asc'))
  unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type !== 'removed') {
        repliesState.value.set(change.doc.id, {
          content: change.doc.data().content || '',
          replyid: change.doc.id,
          author: change.doc.data().author || '',
          created: change.doc.data().created,
          lovesCount: change.doc.data().lovesCount,
          lovers: change.doc.data().lovers
        })
      } else {
        repliesState.value.delete(change.doc.id)
      }
    })
  })
}

export function useReplies (): { replies: ComputedRef<Map<string, Reply>> } {
  return { replies }
}

/**
 * Adds a Comment to a Stream Thread. Returns Promise<void> when done.
 *
 * @param threadid thread id
 * @param author uid of the author
 * @param comment the comment payload as HTML
 */
export async function addReply (threadid: string, author: string, comment: string, mentions: string[]): Promise<void> {
  logEvent(getAnalytics(), 'addComment', { author: author, comment: comment })
  const db = getFirestore()
  const parentRef = doc(db, 'stream', threadid)
  const commentsRef = collection(db, 'stream', threadid, 'comments')
  return addDoc(commentsRef, {
    author: author,
    content: comment,
    created: serverTimestamp(),
    mentions: mentions
  }).then(() => {
    return updateDoc(
      parentRef,
      {
        lastCommentAt: serverTimestamp(),
        flowTime: serverTimestamp(),
        replyCount: increment(1)
      }
    )
  })
}

/**
 * Deletes a Reply from the Thread
 * @param threadid t.
 * @param replyid t.
 */
export async function deleteReply (threadid:string, replyid:string): Promise<void> {
  logEvent(getAnalytics(), 'dropComment')
  const db = getFirestore()
  const parentRef = doc(db, 'stream', threadid)
  const commentRef = doc(db, 'stream', threadid, 'comments', replyid)
  return deleteDoc(commentRef).then(() => {
    return updateDoc(
      parentRef,
      {
        replyCount: increment(-1)
      }
    )
  })
}

export async function updateReplyContent (author: string, threadid: string, replyid: string, contents: string): Promise<void> {
  logEvent(getAnalytics(), 'updateComment', { author: author })
  return updateDoc(
    doc(getFirestore(), 'stream', threadid, 'comments', replyid),
    {
      content: contents,
      updatedBy: author,
      updatedAt: serverTimestamp()
    }
  )
}
