import * as firebase from 'firebase/app'
import 'firebase/firestore'

export interface Post {
    author: string;
    content: string;
    created: number;
    postid: string;
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
}

function dropPost (actor: string, postid: string) {
  const db = firebase.firestore()
  const postRef = db.collection('stream').doc(postid)
  postRef.delete()
}

export function useStream () {
  return { dropPost }
}
