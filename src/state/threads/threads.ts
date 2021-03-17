import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'

import { computed, ComputedRef, ref } from 'vue'
import { getSeconds } from '@/utils/firebaseTools'
import { useProfile } from '../authz'

export interface PostImage {
    url: string;
}

export interface PostData {
    content: string
    topic: string
    title: string
    images?: PostImage[]
    sticky?: boolean
}

export interface Thread {
    // Identity
    id: string;
    author: string;
    // Timestamps
    created: firebase.firestore.Timestamp|null;
    flowTime: firebase.firestore.Timestamp|null;
    updated: firebase.firestore.Timestamp|null;
    // Meta
    replyCount: number;
    lovedCount: number;
    // Payload
    data: PostData
}

export interface Stream {
  slug: string
  name: string
  description: string
  icon: string
  count: number,
  order: number
}

export function toThread (id: string, data?:firebase.firestore.DocumentData): Thread {
  if (!data) {
    return {
      id: id,
      author: '',
      created: null,
      flowTime: null,
      updated: null,
      replyCount: 0,
      lovedCount: 0,
      data: {
        content: '',
        topic: '',
        title: ''
      }
    }
  }
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
      images: data.images,
      sticky: data.sticky || false
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

const localPinnedThreads = ref(new Array<Thread>())
const pinnedThreads = computed(() => (localPinnedThreads.value))

/**
 * Patches a post to the Stream
 */
function patchToSubscribed (thread: Thread|undefined) {
  if (thread) {
    subscribedThreads.value = subscribedThreads.value.filter((p) => (thread.id !== p.id))
    subscribedThreads.value.push(thread)
    subscribedThreads.value = subscribedThreads.value.sort((a, b) => (typeof a.flowTime === 'undefined' ? -1 : getSeconds(b.flowTime) - getSeconds(a.flowTime)))
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
  streamRef.orderBy('flowTime', 'desc').limit(30).onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type !== 'removed') patchToSubscribed(toThread(change.doc.id, change.doc.data()))
      else subscribedThreads.value = subscribedThreads.value.filter((thread) => (thread.id !== change.doc.id))
    })
  })
}

/**
 * fetches the sticky posts for a topic
 *
 * @param topic slug of a topic
 */
async function fetchTopic (topic: string) {
  const db = firebase.firestore()
  const stickyRef = db.collection('stream').where('topic', '==', topic).where('sticky', '==', true)
  try {
    const stickyDocs = await stickyRef.get()
    console.debug('stickyDocs', stickyDocs, topic)
    localPinnedThreads.value = new Array<Thread>()
    stickyDocs.forEach((stickyThread) => {
      localPinnedThreads.value.push(toThread(stickyThread.id, stickyThread.data()))
    })
  } catch (error) {
    console.warn(error)
  }
}

export async function createThread (actor: string, data:PostData): Promise<string> {
  firebase.analytics().logEvent('createThread', { author: actor })
  const db = firebase.firestore()
  const postRef = db.collection('stream').doc()
  return postRef.set({
    author: actor,
    ...data,
    created: firebase.firestore.FieldValue.serverTimestamp(),
    flowTime: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    return postRef.get().then((doc) => {
      return doc.id
    })
  })
}

export async function updateThread (actor: string, post:Thread): Promise<string> {
  if (!post.id) throw new Error('can not update thread without an id')
  firebase.analytics().logEvent('updateThread', { author: actor })
  const db = firebase.firestore()
  const postRef = db.collection('stream').doc(post.id)
  return postRef.update({
    editor: actor,
    ...post.data,
    editTime: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    return post.id
  })
}
const subscribedPage = ref(toThread(''))
const thread = computed(() => (subscribedPage.value))
let unsubscribePage = () => {}

export function subscribeThread (id?: string): void {
  console.log('subscribing thread:', id)
  if (subscribedPage.value.id === id) return
  unsubscribePage()
  subscribedPage.value = toThread(id || '')
  if (!id) return
  const db = firebase.firestore()
  const threadRef = db.collection('stream').doc(id)
  unsubscribePage = threadRef.onSnapshot((doc) => {
    if (doc.exists) {
      console.log('patching thread contents')
      subscribedPage.value = toThread(id, doc.data())
      const { stampSeen } = useProfile()
      stampSeen(id, doc.data()?.flowTime)
    }
  })
}

export async function deleteThread (actor: string, threadid: string): Promise<void> {
  firebase.analytics().logEvent('dropPost', { author: actor })
  const db = firebase.firestore()
  const postRef = db.collection('stream').doc(threadid)
  return postRef.delete()
}

export function useThreads (topic?:string): {
    stream: ComputedRef<Thread[]>
    pinnedThreads: ComputedRef<Thread[]>
    thread: ComputedRef<Thread> } {
  init()
  if (topic) fetchTopic(topic)
  return { stream, thread, pinnedThreads }
}
