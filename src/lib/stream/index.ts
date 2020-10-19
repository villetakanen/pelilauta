import { ref, computed, ComputedRef } from 'vue'
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
    updated: firebase.firestore.Timestamp;
    // Meta
    replyCount: number;
    lovedCount: number;
    // Payload
    data: PostData
}

export interface Profile {
  uid?: string;
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

function toDisplayString (timestamp:firebase.firestore.Timestamp): string {
  const dateString = new Date((timestamp.seconds + 10800) * 1000 + new Date().getTimezoneOffset()).toISOString()
  return dateString.substring(11, 19) + ' - ' + dateString.substring(0, 10)
}

function toPost (postid: string, data:firebase.firestore.DocumentData|undefined): Post|undefined {
  if (!data) return undefined
  const post: Post = {
    postid: postid,
    author: data.author,
    created: data.created,
    flowTime: data.flowTime,
    replyCount: data.replyCount,
    lovedCount: data.lovedCount,
    updated: data.updated,
    data: {
      content: data.content,
      topic: data.topic,
      title: data.title,
      images: data.images
    }
  }
  if (typeof post.data.images === 'string') delete post.data.images
  return post
}

/**
 * Patches a post to the Stream
 */
function patchPostToState (post: Post|undefined) {
  if (post) {
    streamState.value = streamState.value.filter((p) => (post.postid !== p.postid))
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
      if (change.type !== 'removed') patchPostToState(toPost(change.doc.id, change.doc.data()))
      if (change.type === 'removed') streamState.value = streamState.value.filter((post) => (post.postid !== change.doc.id))
    })
  })
}

async function dropPost (actor: string, postid: string) {
  const db = firebase.firestore()
  const postRef = db.collection('stream').doc(postid)
  return postRef.delete()
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

async function updatePost (postid: string, data:PostData) {
  const db = firebase.firestore()
  const postRef = db.collection('stream').doc(postid)

  postRef.update({
    title: data.title,
    content: data.content,
    topic: data.topic,
    images: data.images,
    updated: firebase.firestore.FieldValue.serverTimestamp()
  })
}

export function useStream (): {
  stream: ComputedRef<Post[]>;
  dropPost: (actor: string, postid: string) => Promise<void>;
  updatePost: (postid: string, data:PostData) => Promise<void>;
  addPost: (postData: PostData, author: string) => Promise<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>>;
  toDisplayString: (timestamp:firebase.firestore.Timestamp) => string;
  } {
  subscribe()
  return { stream, dropPost, updatePost, addPost, toDisplayString }
}
