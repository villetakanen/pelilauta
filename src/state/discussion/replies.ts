
// import { computed, ref, ComputedRef } from 'vue'
import { computed, ComputedRef, ref } from 'vue'
import { Reply } from '@/utils/firestoreInterfaces'

let parentThreadId = ''
let unsubscribe:CallableFunction|null = null
const repliesState = ref(new Map<string, Reply>())
const replies = computed(() => (repliesState.value))

export function subscribeToReplies (newId: string): void {
  if (parentThreadId === newId) return // return: no-op
  parentThreadId = newId
  repliesState.value = new Map<string, Reply>()
  if (unsubscribe) unsubscribe()
  const repliesRef = firebase.firestore().collection('stream').doc(newId).collection('comments').orderBy('created', 'asc')
  unsubscribe = repliesRef.onSnapshot((snapshot) => {
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
  firebase.analytics().logEvent('addComment', { author: author, comment: comment })
  const parentRef = firebase.firestore().collection('stream').doc(threadid)
  const commentRef = parentRef.collection('comments')
  console.warn(addReply, mentions)
  return commentRef.add({
    author: author,
    content: comment,
    created: firebase.firestore.FieldValue.serverTimestamp(),
    mentions: mentions
  }).then(() => {
    return parentRef.update({
      lastCommentAt: firebase.firestore.FieldValue.serverTimestamp(),
      flowTime: firebase.firestore.FieldValue.serverTimestamp(),
      replyCount: firebase.firestore.FieldValue.increment(1)
    })
  })
}

/**
 * Deletes a Reply from the Thread
 * @param threadid t.
 * @param replyid t.
 */
export async function deleteReply (threadid:string, replyid:string): Promise<void> {
  firebase.analytics().logEvent('dropComment')
  const parentRef = firebase.firestore().collection('stream').doc(threadid)
  const commentRef = parentRef.collection('comments').doc(replyid)
  return commentRef.delete().then(() => {
    return parentRef.update({
      replyCount: firebase.firestore.FieldValue.increment(-1)
    })
  })
}

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
}
