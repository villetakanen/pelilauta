import { ref, computed } from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

export interface PostImage {
  url: string;
}

export interface PostData {
  content: string;
  topic: string;
  title: string;
  images?: PostImage[];
}

export interface Post {
    // Identity
    postid: string;
    author: string;
    // Timestamps
    created: firebase.firestore.Timestamp;
    flowTime: firebase.firestore.Timestamp;
    updated?: firebase.firestore.Timestamp;
    // Payload
    data: PostData
}

export interface Profile {
  nick: string;
  photoURL: string;
}

export interface Reply {
  content: string;
  replyid: string;
  nick: string;
  author: string;
  createdSeconds?: number;
  created?: firebase.firestore.Timestamp;
}

export interface MenuItem {
  text: string;
  to?: string;
  action?: () => void
  icon?: string;
}

const streamState = ref(new Array<Post>())
const stream = computed(() => (streamState.value))

function toPost (postid: string, data:firebase.firestore.DocumentData|undefined): Post|undefined {
  if (!data) return undefined
  const post = data as Post
  post.data = data as PostData
  post.postid = postid
  return post
}

/**
 * Patches a post to the Stream
 */
function patchPostToState (post: Post|undefined) {
  if (post) {
    streamState.value.push(post)
    streamState.value = streamState.value.sort((a, b) => (typeof a.flowTime === 'undefined' ? -1 : b.flowTime.seconds - a.flowTime.seconds))
  }
}

let init = false

/**
 * subscribe to the strem from firebase
 */
function subscribe () {
  if (init) return
  init = true

  // Firebase references
  const db = firebase.firestore()
  const streamRef = db.collection('stream')
  streamRef.orderBy('flowTime', 'desc').limit(11).onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      console.log('pushing', toPost(change.doc.id, change.doc.data()))
      if (change.type === 'added') patchPostToState(toPost(change.doc.id, change.doc.data()))
      if (change.type === 'removed') streamState.value = streamState.value.filter((post) => (post.postid !== change.doc.id))
    })
  })
}

function dropPost (actor: string, postid: string) {
  const db = firebase.firestore()
  const postRef = db.collection('stream').doc(postid)
  postRef.delete()
}

async function getPost (postid: string): Promise<Post|null> {
  const db = firebase.firestore()
  const postRef = db.collection('stream').doc(postid)

  return new Promise<Post|null>((resolve) => {
    postRef.get().then((postDoc) => {
      if (postDoc.exists) {
        const post = toPost(postDoc.id, postDoc.data())
        resolve(post)
      } else {
        return null
      }
    })
  })
}

async function addPost (postData: PostData, author: string) {
  const db = firebase.firestore()
  const streamRef = db.collection('stream')
  return streamRef.add({
    author: author,
    ...postData,
    created: firebase.firestore.FieldValue.serverTimestamp(),
    flowTime: firebase.firestore.FieldValue.serverTimestamp()
  })
}

function updatePost (postid: string, title: string, content: string, topic: string): void {
  const db = firebase.firestore()
  const postRef = db.collection('stream').doc(postid)

  postRef.update({
    title: title,
    content: content,
    topic: topic,
    updated: firebase.firestore.FieldValue.serverTimestamp()
  })
}

export function useStream () {
  subscribe()
  return { stream, dropPost, getPost, updatePost, addPost }
}
