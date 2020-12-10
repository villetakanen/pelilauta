import { Ref, ref, computed, ComputedRef } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import { createSite } from '.'

export interface Page {
  siteid: string,
  id: string,
  name: string,
  htmlContent: string,
  lastUpdate: firebase.firestore.Timestamp
}
const subscribedPages: Ref<Page[]> = ref(new Array<Page>())
const pages = computed(() => (subscribedPages.value))

let unsubscribe = () => {}

function toPage (siteid:string, pageid:string, data:firebase.firestore.DocumentData|undefined) {
  return {
    siteid: siteid,
    id: pageid,
    name: data?.name || '',
    htmlContent: data?.htmlContent || '',
    lastUpdate: data?.lastUpdate
  }
}

/**
 * Patches a page to the Site
 */
function patchToSubscribed (page: Page|undefined) {
  if (page) {
    subscribedPages.value = subscribedPages.value.filter((p) => (page.id !== p.id))
    subscribedPages.value.push(page)
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

export function usePages (): { pages: ComputedRef<Page[]> } {
  createSite()
  return { pages }
}
