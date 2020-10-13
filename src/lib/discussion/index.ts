
import { computed, ref } from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { Reply } from '../stream'

const discussionState = ref(new Array<Reply>())
const discussion = computed(() => (discussionState.value))

let parentPostid = ''

let unsubscribe = () => {}

function upsertComment (commentid: string, data: object) {
  console.log('upsertComment', commentid, data)
  const comment = data as Reply
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
      flowTime: firebase.firestore.FieldValue.serverTimestamp()
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
          upsertComment(change.doc.id, change.doc.data())
        } else if (change.type === 'removed') {
          discussionState.value = discussionState.value.filter((reply) => (reply.replyid !== change.doc.id))
        }
      })
    })
  }
}
export function useDiscussion (postid: string) {
  console.log('useDiscussion', postid)
  init(postid)
  return { discussion, addComment }
}
