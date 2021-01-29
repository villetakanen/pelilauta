import { Ref, ref, computed, ComputedRef } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import { toMekanismiURI } from '@/utils/contentFormat'

export interface Page {
  siteid: string,
  id: string,
  name: string,
  category: string,
  htmlContent: string,
  lastUpdate: firebase.firestore.Timestamp|null
}
export interface PageFragment {
  siteid: string,
  id: string,
  author?: string,
  name?: string,
  category?: string,
  htmlContent?: string,
  lastUpdate?: firebase.firestore.Timestamp|null
}

const subscribedPages: Ref<Page[]> = ref(new Array<Page>())
const pages = computed(() => (subscribedPages.value))

let requestedPage = '::none::'
const statePage: Ref<Page> = ref(toPage())
const page = computed(() => (statePage.value))

let unsubscribe = () => {}

function toPage (siteid?:string, id?:string, data?:firebase.firestore.DocumentData): Page {
  if (!siteid || !id) {
    return {
      siteid: '',
      id: '',
      name: 'not found',
      htmlContent: '',
      category: '',
      lastUpdate: null
    }
  }
  return {
    siteid: siteid,
    id: id,
    name: data?.name || '',
    htmlContent: data?.htmlContent || data?.content || '',
    category: data?.category || '',
    lastUpdate: data?.lastUpdate || null
  }
}

export function usePage (id: string): ComputedRef<Page> {
  if (requestedPage !== id) statePage.value = subscribedPages.value.find((p) => (p.id === id)) || toPage()
  requestedPage = id
  return computed(() => (statePage.value))
}

export function fetchPage (id: string): void {
  if (requestedPage === id) return
  requestedPage = id
  statePage.value = subscribedPages.value.find((p) => (p.id === id)) || toPage()
}

/**
 * Patches a page to the Site
 */
function patchToSubscribed (page: Page|undefined) {
  if (page) {
    subscribedPages.value = subscribedPages.value.filter((p) => (page.id !== p.id))
    subscribedPages.value.push(page)
    if (page.id === requestedPage) {
      statePage.value = page
    }
    subscribedPages.value.sort((a, b) => {
      if (a.name < b.name) { return -1 }
      if (a.name > b.name) { return 1 }
      return 0
    })
  }
}
/**
 * Patches a post to the Stream
 */
function dropFromSubscribed (pageid: string) {
  subscribedPages.value = subscribedPages.value.filter((p) => (pageid !== p.id))
}

export function subscribeTo (siteid:string|null|undefined): void {
  if (!siteid) {
    unsubscribe()
    return
  }
  const db = firebase.firestore()
  const siteRef = db.collection('sites').doc(siteid)
  const pagesRef = siteRef.collection('pages')
  unsubscribe = pagesRef.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'removed') {
        dropFromSubscribed(change.doc.id)
      } else {
        patchToSubscribed(toPage(siteid, change.doc.id, change.doc.data()))
      }
    })
  })
}

export async function updatePage (page: PageFragment): Promise<void> {
  console.log('update data: ', page.id, page)
  const db = firebase.firestore()
  const pageRef = db.collection('sites').doc(page.siteid).collection('pages').doc(page.id)
  return pageRef.update(page).then(() => {
    const siteRef = db.collection('sites').doc(page.siteid)
    return siteRef.update({ lastUpdate: firebase.firestore.FieldValue.serverTimestamp() })
  })
}

export async function addPage (authorUid: string, siteid: string, pageName: string): Promise<void> {
  const pageid = toMekanismiURI(pageName)

  const db = firebase.firestore()
  const pageRef = db.collection('sites').doc(siteid).collection('pages').doc(pageid)

  firebase.analytics().logEvent('addPage', { site: siteid, page: pageid, author: authorUid })

  return pageRef.set({
    author: authorUid,
    creator: authorUid,
    name: pageName,
    created: firebase.firestore.FieldValue.serverTimestamp(),
    lastUpdate: firebase.firestore.FieldValue.serverTimestamp(),
    htmlContent: '<p>...</p>'
  })
}

export function usePages (): { pages: ComputedRef<Page[]>, page:ComputedRef<Page> } {
  return { pages, page }
}
