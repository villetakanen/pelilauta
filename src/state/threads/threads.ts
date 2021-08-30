import { computed, ComputedRef, ref } from 'vue'
import { getSeconds } from '@/utils/firebaseTools'
import { useAuth, useProfile } from '../authz'
import { Thread, PostData } from '@/utils/firestoreInterfaces'
import { addDoc, collection, deleteDoc, doc, DocumentData, DocumentReference, getDocs, getFirestore, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from '@firebase/firestore'
import { getAnalytics, logEvent } from '@firebase/analytics'

export interface Stream {
  slug: string
  name: string
  description: string
  icon: string
  count: number,
  order: number
}

export function toThread (id: string, data?:DocumentData): Thread {
  if (!data) {
    return {
      id: id,
      author: '',
      created: null,
      flowTime: null,
      updated: null,
      replyCount: 0,
      lovedCount: 0,
      seenCount: 0,
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
    replyCount: data.replyCount || 0,
    lovedCount: data.lovedCount || 0,
    seenCount: data.seenCount || 0,
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

  const analytics = getAnalytics()
  logEvent(analytics, 'firestore_stream_subscribed')

  const db = getFirestore()
  const streamRef = collection(db, 'stream')
  const q = query(streamRef, orderBy('flowTime', 'desc'), limit(30))
  onSnapshot(q, (snapshot) => {
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
  const db = getFirestore()
  const q = query(collection(db, 'stream'), where('topic', '==', topic), where('sticky', '==', true), orderBy('flowTime', 'desc'))
  try {
    const stickyDocs = await getDocs(q)
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
  const db = getFirestore()
  const q = query(collection(db, 'stream'), where('site', '==', siteid), orderBy('flowTime', 'desc'))
  try {
    const siteDocs = await getDocs(q)
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
  logEvent(getAnalytics(), 'createThread', { author: actor })
  const db = getFirestore()
  return addDoc(collection(db, 'stream'), {
    author: actor,
    ...data,
    created: serverTimestamp(),
    flowTime: serverTimestamp()
  }).then((d) => {
    return d.id
  })
}

export async function updateThread (actor: string, post:Thread): Promise<string> {
  if (!post.id) throw new Error('can not update thread without an id')
  logEvent(getAnalytics(), 'updateThread', { author: actor })
  console.debug('updateThread', post)
  const db = getFirestore()
  return updateDoc(doc(db, 'stream', post.id), {
    editor: actor,
    ...post.data,
    title: post.data.title || '',
    images: post.data.images || null,
    content: post.data.content || '',
    sticky: post.data.sticky || false,
    site: post.site || '',
    editTime: serverTimestamp()
  }).then(() => {
    return post.id
  })
}
const subscribedPage = ref(toThread(''))
const thread = computed(() => (subscribedPage.value))
let unsubscribePage = () => {}

function subscribeThread (id?: string): void {
  if (subscribedPage.value.id === id) return
  unsubscribePage()
  subscribedPage.value = toThread(id || '')
  if (!id) return
  const db = getFirestore()
  const threadRef = doc(db, 'stream', id)
  unsubscribePage = onSnapshot(threadRef, (doc) => {
    if (doc.exists()) {
      subscribedPage.value = toThread(id, doc.data())
      const { stampSeen } = useProfile()
      stampSeen(id, doc.data()?.flowTime)
      dispatchThreadSeen()
    }
  })
}

export async function deleteThread (actor: string, threadid: string): Promise<void> {
  logEvent(getAnalytics(), 'dropPost', { author: actor })
  const db = getFirestore()
  const threadRef = doc(db, 'stream', threadid)
  return deleteDoc(threadRef)
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
 * @returns {Promise<void | DocumentReference<DocumentData>>} A promise for dispatch completion
 */
async function dispatchThreadSeen (): Promise<void | DocumentReference<DocumentData>> {
  const { user } = useAuth()
  if (!user.value.uid) {
    console.error('Trying to dispatch an event before we have uid: aborting op', user.value)
    return
  }
  const db = getFirestore()
  const eventsRef = collection(db, 'inbound')
  const q = query(eventsRef,
    where('uid', '==', user.value.uid),
    where('type', '==', FB_INBOUND_EVENT_THREAD_SEEN),
    where('threadid', '==', subscribedPage.value.id))
  const eventDocs = await getDocs(q)

  const event = {
    type: FB_INBOUND_EVENT_THREAD_SEEN,
    uid: user.value.uid,
    threadid: subscribedPage.value.id,
    timestamp: serverTimestamp()
  }

  if (eventDocs.empty) {
    return addDoc(collection(db, 'inbound'), event)
  } else {
    const eventDoc = eventDocs.docs[0]
    return setDoc(doc(db, 'inbound', eventDoc.id), event)
  }
}

export function useThreads (topic?:string): {
    stream: ComputedRef<Thread[]>
    pinnedThreads: ComputedRef<Thread[]>
    siteThreads: ComputedRef<Thread[]>
    thread: ComputedRef<Thread>,
    subscribeThread: (id?: string | undefined) => void} {
  init()
  if (topic) fetchTopic(topic)
  return { stream, thread, pinnedThreads, siteThreads, subscribeThread }
}
