import * as firebase from 'firebase/app'
import 'firebase/firestore'

export interface Post {
    author: string;
    content: string;
    created: number;
    postid: string;
    topic: string;
    title: string;
    images?: string;
}
export interface PostData {
  author: string;
  content: string;
  created: number;
  topic: string;
  title: string;
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
}

export interface MenuItem {
  text: string;
  to?: string;
  action?: Function;
  icon?: string;
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
        const post = postDoc.data() as Post
        post.postid = postDoc.id
        resolve(post)
      } else {
        return null
      }
    })
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
  return { dropPost, getPost, updatePost }
}
