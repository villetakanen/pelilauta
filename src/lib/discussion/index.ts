
import { computed, ref, ComputedRef } from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { Reply } from '../stream'

const discussionState = ref(new Array<Reply>())
const discussion = computed(() => (discussionState.value))

let parentPostid = ''

let unsubscribe = () => {}

function upsertComment (commentid: string, data: Reply) {
  console.log('upsertComment', commentid, data)
  const comment = { ...data }
  comment.replyid = commentid
  discussionState.value.push(comment)
}

function addComment (author: string, nick: string, comment: string) {
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
  const parentRef = firebase.firestore().collection('stream').doc(parentPostid)
  const commentRef = parentRef.collection('comments').doc(commentid)
  commentRef.delete().then(() => {
    parentRef.update({
      replyCount: firebase.firestore.FieldValue.increment(-1)
    })
  })
}

function init (postid: string) {
  if (postid && postid !== parentPostid) {
    parentPostid = postid
    discussionState.value = new Array<Reply>()
    unsubscribe()
    const discussionRef = firebase.firestore().collection('stream').doc(postid).collection('comments').orderBy('created', 'asc')
    unsubscribe = discussionRef.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          upsertComment(change.doc.id, change.doc.data() as Reply)
        } else if (change.type === 'removed') {
          discussionState.value = discussionState.value.filter((reply) => (reply.replyid !== change.doc.id))
        }
      })
    })
  }
}
export function useDiscussion (postid: string): {
  discussion: ComputedRef<Reply[]>;
  addComment: (author: string, nick: string, comment: string) => void;
  deleteComment: (commentid: string) => void;
} {
  console.log('useDiscussion', postid)
  init(postid)
  return { discussion, addComment, deleteComment }
}
