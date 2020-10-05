export interface Post {
    author: string;
    content: string;
    created: number;
    postid: string;
    topic?: string;
    title?: string;
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
