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

export interface Asset {
  name: string
  url: string
  lastUpdate: firebase.firestore.Timestamp|null
  creator: string
  fullPath: string
}
