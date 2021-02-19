import firebase from 'firebase/app'

export interface Reply {
  content: string;
  replyid: string;
  nick?: string;
  author: string;
  created?: firebase.firestore.Timestamp;
  lovesCount?: number;
  lovers?: Array<string>;
}
