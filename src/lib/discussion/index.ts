
import { computed, ref, ComputedRef } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { Reply } from '../stream'
import 'firebase/analytics'
import { useProfile } from '@/state/authz'

const discussionState = ref(new Array<Reply>())
const discussion = computed(() => (discussionState.value))

let parentPostid = ''

let unsubscribe = () => {}

function upsertComment (commentid: string, data: Reply) {
  // console.log('upsertReply', commentid)
  const comment = { ...data }
  comment.replyid = commentid
  discussionState.value = discussionState.value.filter((a) => (a.replyid !== commentid))
  discussionState.value.push(comment)
  discussionState.value.sort((a, b) => (typeof a.created === 'undefined' || typeof b.created === 'undefined' ? -1 : a.created.seconds - b.created.seconds))
}

/**
 * Adds a Comment to a Stream Thread. Returns Promise<void> when done.
 *
 * @param author uid of the autor
 * @param nick current nick for the author, @deprecated
 * @param comment the comment payload as HTML
 */
async function addComment (author: string, nick: string, comment: string): Promise<void> {
  firebase.analytics().logEvent('addComment', { author: author, comment: comment })
  const parentRef = firebase.firestore().collection('stream').doc(parentPostid)
  const commentRef = parentRef.collection('comments')
  return commentRef.add({
    author: author,
    nick: nick,
    content: comment,
    created: firebase.firestore.FieldValue.serverTimestamp() || { seconds: 0 }
  }).then(() => {
    return parentRef.update({
      lastCommentAt: firebase.firestore.FieldValue.serverTimestamp(),
      flowTime: firebase.firestore.FieldValue.serverTimestamp(),
      replyCount: firebase.firestore.FieldValue.increment(1)
    })
  })
}

function deleteComment (commentid:string) {
  firebase.analytics().logEvent('dropComment')
  const parentRef = firebase.firestore().collection('stream').doc(parentPostid)
  const commentRef = parentRef.collection('comments').doc(commentid)
  commentRef.delete().then(() => {
    parentRef.update({
      replyCount: firebase.firestore.FieldValue.increment(-1)
    })
  })
}

function init (threadid?: string) {
  if (threadid && threadid !== parentPostid) {
    parentPostid = threadid
    discussionState.value = new Array<Reply>()
    unsubscribe()
    const discussionRef = firebase.firestore().collection('stream').doc(threadid).collection('comments').orderBy('created', 'asc')
    unsubscribe = discussionRef.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type !== 'removed') {
          upsertComment(change.doc.id, change.doc.data() as Reply)
        } else {
          discussionState.value = discussionState.value.filter((reply) => (reply.replyid !== change.doc.id))
        }
      })
    })
  }
}
export function useDiscussion (threadid?: string): {
  discussion: ComputedRef<Reply[]>
  addComment: (author: string, nick: string, comment: string) => Promise<void>
  deleteComment: (commentid: string) => void
} {
  if (threadid) init(threadid)
  return { discussion, addComment, deleteComment }
}
