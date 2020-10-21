import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'

import { computed, ComputedRef, ref } from 'vue'
import { useStream } from '@/lib/stream'

export interface PostImage {
    url: string;
}

export interface PostData {
    content: string;
    topic: string;
    title: string;
    images?: PostImage[];
}

export interface Thread {
    // Identity
    id: string;
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

const threadStore = ref(new Map<string, Thread>())

function toThread (id: string, data:firebase.firestore.DocumentData|undefined): Thread {
  if (!data) throw new Error('toThread from undefined')
  const post: Thread = {
    id: id,
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
 * Gets the metadata and opening post for a Thread
 *
 * If the thread is already part of stream and thus subscribed, we use the copy
 * from the stream. If not, we'll try to fetch it from the Firestore.
 *
 * @param threadid the firestore id of the doc
 */
export function useThread (threadid: string): ComputedRef<Thread> {
  // @todo: move threads-in-state, like the sream, here:
  if (threadStore.value.has(threadid)) {
    return computed(():Thread => (threadStore.value.get(threadid) as Thread))
  }
  // @todo: refactor stream subscriptions into this module
  const { stream } = useStream()
  const threadInStream = stream.value.find((val) => (val.postid === threadid))
  // Post and Thread interfaces are the same, former shoud be deprecated
  // as the todo above is done.
  if (threadInStream) return computed(() => ((threadInStream as unknown) as Thread))

  const analytics = firebase.analytics()
  analytics.logEvent('Direct fetch of a thread', { id: threadid })
  console.log('Direct fetch of a thread', { id: threadid })
  const db = firebase.firestore()
  db.collection('stream').doc(threadid).get().then((doc) => {
    if (doc.exists) return toThread(doc.id, doc.data())
  })
  throw new Error('thread not found')
}
