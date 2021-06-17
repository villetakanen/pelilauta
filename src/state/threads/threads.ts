import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'

import { computed, ComputedRef, ref } from 'vue'
import { getSeconds } from '@/utils/firebaseTools'
import { useAuth, useProfile } from '../authz'
import { Thread, PostData } from '@/utils/firestoreInterfaces'

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
      hidden: false,
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
    site: data.site || '',
    hidden: data.hidden || false,
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
  if ('youTubeSlug' in data) post.data.youTubeSlug = data.youTubeSlug
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
  const stickyRef = db.collection('stream').where('topic', '==', topic).where('sticky', '==', true).orderBy('flowTime', 'desc')
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

const localSiteThreads = ref(new Array<Thread>())
const siteThreads = computed(() => (localSiteThreads.value))

/**
 * fetches the posts for a site
 *
 * @param siteid slug of a site
 */
export async function fetchSite (siteid: string): Promise<void> {
  // console.debug('fetchSite', siteid)
  const db = firebase.firestore()
  const siteRef = db.collection('stream').where('site', '==', siteid).orderBy('flowTime', 'desc')
  try {
    const siteDocs = await siteRef.get()
    // console.debug('fetchSite', siteDocs, siteid)
    localSiteThreads.value = new Array<Thread>()
    siteDocs.forEach((siteDocs) => {
      localSiteThreads.value.push(toThread(siteDocs.id, siteDocs.data()))
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
  console.debug('updateThread', post)
  const db = firebase.firestore()
  const postRef = db.collection('stream').doc(post.id)
  return postRef.update({
    editor: actor,
    ...post.data,
    title: post.data.title || '',
    images: post.data.images || null,
    content: post.data.content || '',
    sticky: post.data.sticky || false,
    site: post.site || '',
    editTime: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    return post.id
  })
}
const subscribedPage = ref(toThread(''))
const thread = computed(() => (subscribedPage.value))
let unsubscribePage = () => {}

export function subscribeThread (id?: string): void {
  if (subscribedPage.value.id === id) return
  unsubscribePage()
  subscribedPage.value = toThread(id || '')
  if (!id) return
  const db = firebase.firestore()
  const threadRef = db.collection('stream').doc(id)
  unsubscribePage = threadRef.onSnapshot((doc) => {
    if (doc.exists) {
      subscribedPage.value = toThread(id, doc.data())
      const { stampSeen } = useProfile()
      stampSeen(id, doc.data()?.flowTime)
      dispatchThreadSeen()
    }
  })
}

export async function deleteThread (actor: string, threadid: string): Promise<void> {
  firebase.analytics().logEvent('dropPost', { author: actor })
  const db = firebase.firestore()
  const postRef = db.collection('stream').doc(threadid)
  return postRef.delete()
}

const FB_INBOUND_EVENT_THREAD_SEEN = 'thread seen'

/**
 * Send Thread Seen event to cloud-side inbound queue as Add or Set
 * depending if there exists an event for the user and thread
 *
 * Uses
 * - user.uid from useAuth() as uid, and
 * - thread.id as threadid
 *
 * @returns {Promise<void | firebase.firestore.DocumentReference<firebase.firestore.DocumentData>>} A promise for dispatch completion
 */
async function dispatchThreadSeen (): Promise<void | firebase.firestore.DocumentReference<firebase.firestore.DocumentData>> {
  const { user } = useAuth()
  if (!user.value.uid) {
    console.warn('Trying to dispatch an event before we have uid: aborting op', user.value)
    return
  }
  const db = firebase.firestore()
  const eventsRef = db.collectionGroup('inbound')
    .where('type', '==', FB_INBOUND_EVENT_THREAD_SEEN)
    .where('threadid', '==', subscribedPage.value.id)
    .where('uid', '==', user.value.uid)
  // const eventDocs = await eventsRef.get()

  const event = {
    type: FB_INBOUND_EVENT_THREAD_SEEN,
    uid: user.value.uid,
    threadid: subscribedPage.value.id,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }

  /* if (eventDocs.empty) {
    return db.collection('inbound').add(event)
  } else {
    const eventDoc = eventDocs.docs[0]
    return db.collection('inbound').doc(eventDoc.id).set(event)
  } */
}

export function useThreads (topic?:string): {
    stream: ComputedRef<Thread[]>
    pinnedThreads: ComputedRef<Thread[]>
    siteThreads: ComputedRef<Thread[]>
    thread: ComputedRef<Thread> } {
  init()
  if (topic) fetchTopic(topic)
  return { stream, thread, pinnedThreads, siteThreads }
}
