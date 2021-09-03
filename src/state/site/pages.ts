import { Ref, ref, computed, ComputedRef } from 'vue'
import { toMekanismiURI } from '@/utils/contentFormat'
import { useSite } from '.'
import { doc, getFirestore, serverTimestamp, Timestamp, collection, DocumentData, onSnapshot, deleteDoc, updateDoc, setDoc, getDoc } from '@firebase/firestore'
import { getAnalytics, logEvent } from '@firebase/analytics'

export interface Page {
  siteid: string,
  id: string,
  name: string,
  category: string,
  htmlContent: string,
  lastUpdate: Timestamp|null
}
export interface PageFragment {
  siteid: string,
  id: string,
  author?: string,
  name?: string,
  category?: string,
  htmlContent?: string,
  lastUpdate?: Timestamp|null
}

const subscribedPages: Ref<Page[]> = ref(new Array<Page>())
const pages = computed(() => (subscribedPages.value))

let requestedPage = '::none::'
const statePage: Ref<Page> = ref(toPage())
const page = computed(() => (statePage.value))

let unsubscribe = () => {}

function toPage (siteid?:string, id?:string, data?:DocumentData): Page {
  if (!siteid || !id) {
    return {
      siteid: '',
      id: '',
      name: '',
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

/**
 * Site state internal subscription to Pages of the site. This is called primarily from index.ts
 *
 * @param siteid id of the site we subscribe to.
 */
export function subscribeTo (siteid:string|null|undefined): void {
  // flush the state. Do note that the site subscription code in index.ts contains
  // some code to skip unneccessary flushes, and thus this function should only be
  // called from there.
  subscribedPages.value = new Array<Page>()
  if (!siteid) {
    unsubscribe()
    return
  }
  const db = getFirestore()
  const pagesRef = collection(db, 'sites', siteid, 'pages')
  unsubscribe = onSnapshot(pagesRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'removed') {
        dropFromSubscribed(change.doc.id)
      } else {
        patchToSubscribed(toPage(siteid, change.doc.id, change.doc.data()))
      }
    })
  })
}

export async function deletePage (siteid: string, pageid:string): Promise<void> {
  return deleteDoc(
    doc(getFirestore(), 'sites', siteid, 'pages', pageid)
  )
}

export async function updatePage (page: PageFragment): Promise<void> {
  console.debug('Page fragment for update', page.id, page)
  const { site } = useSite()
  const db = getFirestore()
  const pageRef = doc(db, 'sites', page.siteid, 'pages', page.id)
  return updateDoc(pageRef, {
    ...page,
    hidden: site.value.hidden || false,
    silent: site.value.silent || false,
    lastUpdate: serverTimestamp()
  }).then(() => {
    return updateDoc(
      doc(db, 'sites', page.siteid),
      { lastUpdate: serverTimestamp() }
    )
  })
}

export async function addPage (authorUid: string, siteid: string, pageName: string): Promise<void> {
  const pageid = toMekanismiURI(pageName)

  logEvent(getAnalytics(), 'addPage', { site: siteid, page: pageid, author: authorUid })

  const docRef = doc(getFirestore(), 'sites', siteid, 'pages', pageid)

  const pageDoc = await getDoc(docRef)
  if (pageDoc.exists()) throw new Error('Trying to create a page that already exists')

  return setDoc(
    docRef,
    {
      author: authorUid,
      creator: authorUid,
      name: pageName,
      created: serverTimestamp(),
      lastUpdate: serverTimestamp(),
      htmlContent: '<p>...</p>'
    }
  )
}

export function usePages (): { pages: ComputedRef<Page[]>, page:ComputedRef<Page> } {
  return { pages, page }
}
