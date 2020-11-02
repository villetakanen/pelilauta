import firebase from 'firebase/app'
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
  if (!post.replyCount) post.replyCount = 0
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
