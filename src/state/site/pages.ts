import { Ref, ref, computed, watch, ComputedRef } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import { useRoute } from 'vue-router'

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

function subscribeTo (siteid:string|null|undefined) {
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

let _init = false
function init () {
  if (_init) return
  _init = true

  firebase.analytics().logEvent('Init members')

  const route = useRoute()
  subscribeTo(Array.isArray(route.params.siteid) ? route.params.siteid[0] : route.params.siteid)
  watch(route, () => {
    subscribeTo(Array.isArray(route.params.siteid) ? route.params.siteid[0] : route.params.siteid)
  })
}

export function usePages (): { pages: ComputedRef<Page[]> } {
  init()
  return { pages }
}
