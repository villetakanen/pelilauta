import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'

import { computed, ComputedRef, ref } from 'vue'

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

const subscribedThreads = ref(new Array<Thread>())
const stream = computed(() => {
  return subscribedThreads.value
})

/**
 * Patches a post to the Stream
 */
function patchToSubscribed (thread: Thread|undefined) {
  if (thread) {
    subscribedThreads.value = subscribedThreads.value.filter((p) => (thread.id !== p.id))
    subscribedThreads.value.push(thread)
    subscribedThreads.value = subscribedThreads.value.sort((a, b) => (typeof a.flowTime === 'undefined' ? -1 : b.flowTime.seconds - a.flowTime.seconds))
  }
}

let _init = false
function init () {
  if (_init) return
  _init = true

  firebase.analytics().logEvent('firestore_stream_subscribed')

  // Firebase references
  const db = firebase.firestore()
  const streamRef = db.collection('stream')
  streamRef.orderBy('flowTime', 'desc').limit(21).onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type !== 'removed') patchToSubscribed(toThread(change.doc.id, change.doc.data()))
      else subscribedThreads.value = subscribedThreads.value.filter((thread) => (thread.id !== change.doc.id))
    })
  })
}

export async function fetchThread (threadid: string): Promise<Thread|undefined> {
  if (subscribedThreads.value.find((val) => (val.id === threadid))) {
    // eslint-disable-next-line
    console.warn('Fetching an already subscibed thread from Firebase. Please use the Thread from the computed { stream } instead')
  }
  const db = firebase.firestore()
  return db.collection('stream').doc(threadid).get().then((doc) => {
    if (doc.exists) return toThread(doc.id, doc.data())
  })
}

export function useThreads (): {
    stream: ComputedRef<Thread[]> } {
  init()
  return { stream }
}
/* *
 * Gets the metadata and opening post for a Thread
 *
 * If the thread is already part of stream and thus subscribed, we use the copy
 * from the stream. If not, we'll try to fetch it from the Firestore.
 *
 * @param threadid the firestore id of the doc
 * /
/* (threadid: string): Promise<ComputedRef<Thread>> {
  // @todo: move threads-in-state, like the sream, here:
  if (threadStore.value.has(threadid)) {
    return computed(():Thread => (threadStore.value.get(threadid) as Thread))
  }
  // @todo: refactor stream subscriptions into this module
  const { stream } = useStream()
  const threadInStream = stream.value.find((val) => (val.threadid === threadid))
  // Post and Thread interfaces are the same, former shoud be deprecated
  // as the todo above is done.
  if (threadInStream) return computed(() => ((threadInStream as unknown) as Thread))

  const analytics = firebase.analytics()
  analytics.logEvent('Direct fetch of a thread', { id: threadid })
  console.log('Direct fetch of a thread', { id: threadid })
  const db = firebase.firestore()
  return new Promise(() => {
    db.collection('stream').doc(threadid).get().then((doc) => {
      if (doc.exists) return toThread(doc.id, doc.data())
    })
  })
} */
