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

export interface PostImage {
  url: string;
}

export interface PostData {
  content: string
  topic: string
  title: string
  images?: PostImage[]
  sticky?: boolean,
  youTubeSlug?: string
}

export interface Thread {
  // Identity
  id: string
  author: string
  // Timestamps
  created: firebase.firestore.Timestamp|null
  flowTime: firebase.firestore.Timestamp|null
  updated: firebase.firestore.Timestamp|null
  // Meta
  replyCount: number
  lovedCount: number
  seenCount: number
  site?: string // this is a wikisite slug
  // Payload
  data: PostData
  hidden: boolean
}

export interface NotificationMessage {
  source: {
    type: string
    id: string
    title: string
    message?: string
  }
  meta: {
    new?: boolean
    author?: string
  }
}

export interface PCStat {
  key: string
  value: string|number|boolean
}

export interface PlayerCharacter {
  id: string,
  name: string,
  playerid: string,
  type: string
  description: string
  stats?: PCStat[]
}
