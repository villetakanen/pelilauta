import { Ref, ref, computed, ComputedRef } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import { toMekanismiURI } from '@/utils/contentFormat'

export interface Page {
  siteid: string,
  id: string,
  name: string,
  htmlContent: string,
  lastUpdate: firebase.firestore.Timestamp|null
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
      lastUpdate: null
    }
  }
  return {
    siteid: siteid,
    id: id,
    name: data?.name || '',
    htmlContent: data?.htmlContent || data?.content || '',
    lastUpdate: data?.lastUpdate || null
  }
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

export function updatePage (pageid: string, content: string): void {
  console.log('update: ', pageid, content)
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

/**
 * Creates Mekanismi State functionality for a page, and
 * starts Listening to changes for the page
 *
 * This functionality is not needed befor a user accesses a wiki page
 * /
function createPage (): void {
  if (_init) return
  _init = true
  const route = useRoute()
  watch(
    route,
    () => {
      routePageid.value = Array.isArray(route.params.pageid) ? route.params.pageid[0] : route.params.pageid || ''
      statePage.value = pages.value.find((p) => (p.id === routePageid.value)) || toPage()
      console.log('route page to: ', routePageid.value)
    },
    { immediate: true }
  )
} */

export function usePages (): { pages: ComputedRef<Page[]>, page:ComputedRef<Page> } {
  // createPage()
  return { pages, page }
}
