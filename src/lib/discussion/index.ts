
import { computed, ref, ComputedRef } from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { Reply } from '../stream'
import 'firebase/analytics'

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

function addComment (author: string, nick: string, comment: string) {
  firebase.analytics().logEvent('addComment', { author: author })
  const parentRef = firebase.firestore().collection('stream').doc(parentPostid)
  const commentRef = parentRef.collection('comments')
  commentRef.add({
    author: author,
    nick: nick,
    content: comment,
    created: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    parentRef.update({
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

function init (threadid: string) {
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
export function useDiscussion (threadid: string): {
  discussion: ComputedRef<Reply[]>;
  addComment: (author: string, nick: string, comment: string) => void;
  deleteComment: (commentid: string) => void;
} {
  init(threadid)
  return { discussion, addComment, deleteComment }
}
