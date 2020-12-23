import { Ref, ref, computed, ComputedRef, watch } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import { createSite } from '.'
import { useRoute } from 'vue-router'

export interface Page {
  siteid: string,
  id: string,
  name: string,
  htmlContent: string,
  lastUpdate: firebase.firestore.Timestamp|null
}

let _init = false
const routePageid = ref('')
const pageid = computed(() => (routePageid.value))

const subscribedPages: Ref<Page[]> = ref(new Array<Page>())
const pages = computed(() => (subscribedPages.value))

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

/**
 * Patches a page to the Site
 */
function patchToSubscribed (page: Page|undefined) {
  if (page) {
    subscribedPages.value = subscribedPages.value.filter((p) => (page.id !== p.id))
    subscribedPages.value.push(page)
    if (page.id === routePageid.value) {
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
  console.log('members.ts: subscribeTo', siteid)
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

/**
 * Creates Mekanismi State functionality for a page, and
 * starts Listening to changes for the page
 *
 * This functionality is not needed befor a user accesses a wiki page
 */
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
}

export function usePages (): { pages: ComputedRef<Page[]>, pageid: ComputedRef<string>, page:ComputedRef<Page> } {
  createSite()
  createPage()
  return { pages, pageid, page }
}
