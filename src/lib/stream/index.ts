import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'

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
    threadid: string;
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
  admin?: boolean;
}

function toDisplayString (timestamp:firebase.firestore.Timestamp): string {
  const dateString = new Date((timestamp.seconds + 10800) * 1000 + new Date().getTimezoneOffset()).toISOString()
  return dateString.substring(11, 19) + ' - ' + dateString.substring(0, 10)
}

async function dropPost (actor: string, threadid: string) {
  firebase.analytics().logEvent('dropPost', { author: actor })
  const db = firebase.firestore()
  const postRef = db.collection('stream').doc(threadid)
  return postRef.delete()
}

async function addPost (postData: PostData, author: string) {
  firebase.analytics().logEvent('addPost', { author: author })
  const db = firebase.firestore()
  const streamRef = db.collection('stream')
  return streamRef.add({
    author: author,
    ...postData,
    created: firebase.firestore.FieldValue.serverTimestamp(),
    flowTime: firebase.firestore.FieldValue.serverTimestamp()
  })
}

async function updatePost (threadid: string, data:PostData) {
  const db = firebase.firestore()
  const postRef = db.collection('stream').doc(threadid)

  postRef.update({
    title: data.title,
    content: data.content,
    topic: data.topic,
    images: data.images,
    updated: firebase.firestore.FieldValue.serverTimestamp()
  })
}

export function useStream (): {
  dropPost: (actor: string, threadid: string) => Promise<void>;
  updatePost: (threadid: string, data:PostData) => Promise<void>;
  addPost: (postData: PostData, author: string) => Promise<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>>;
  toDisplayString: (timestamp:firebase.firestore.Timestamp) => string;
  } {
  return { dropPost, updatePost, addPost, toDisplayString }
}
