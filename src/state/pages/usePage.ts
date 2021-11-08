import { ref, computed, ComputedRef } from 'vue'
import { Timestamp, DocumentData, serverTimestamp, addDoc, onSnapshot, doc, collection, getFirestore, updateDoc, FieldValue, deleteDoc } from '@firebase/firestore'
import { useAuth } from '../authz'
import { useSite } from '../site'

export class Page {
  id:string // Firebase object id for the entity. Empty string on a new Page
  name:string // Mandatory field from UX perspective
  htmlContent:string // Contents of the page, in HTML format
  author:string // a firebase owner for the new page
  lastUpdate: Timestamp|FieldValue //
  category:string

  constructor (id?:string, data?:DocumentData) {
    this.id = id || ''
    this.name = data?.name || ''
    this.htmlContent = data?.htmlContent || ''
    this.author = data?.author || ''
    this.lastUpdate = data?.lastUpdate || null
    this.category = data?.category || ''
  }

  dry ():DocumentData {
    return {
      name: this.name,
      htmlContent: this.htmlContent,
      author: this.author,
      category: this.category,
      lastUpdate: this.lastUpdate || serverTimestamp()
    }
  }
}

const activePage = ref(new Page())
const page = computed(() => (activePage.value))

export async function createPage (newPage:Page): Promise<string> {
  console.debug('createPage', Page)

  // As we are creating a new page, force the creator to be the
  // current user!
  if (newPage.author) console.warn('Trying to create a page with pre-set author -> page author set to current user')
  const { user } = useAuth()
  newPage.author = user.value.uid

  const { site } = useSite()
  const createdDoc = await addDoc(
    collection(
      getFirestore(),
      'sites',
      site.value.id,
      'pages'
    ),
    newPage.dry()
  )
  return createdDoc.id
}

export interface PageLogEntry {
  id: string,
  name: string,
  author: string
}

export async function savePage (updatedPage:Page): Promise<void> {
  const { site } = useSite()
  const { user } = useAuth()

  updatedPage.lastUpdate = serverTimestamp()

  console.debug('site', site.value, 'page', updatedPage)

  // Adds an entry to site latest pages. This code might belong to cloud functions
  let latestPages = site.value.latestPages || new Array<PageLogEntry>()
  latestPages = latestPages.filter((page) => (page.id !== updatedPage.id))
  if (latestPages.length > 2) latestPages.length = 2
  latestPages.push({
    id: updatedPage.id,
    name: updatedPage.name,
    author: user.value.uid
  })
  latestPages.reverse()
  // End latest pages entry code, it's updated to site data below

  await updateDoc(
    doc(
      getFirestore(),
      'sites',
      site.value.id,
      'pages',
      updatedPage.id
    ),
    {
      ...updatedPage.dry(),
      hidden: site.value.hidden || false,
      silent: site.value.silent || false
    })
  return updateDoc(
    doc(
      getFirestore(),
      'sites',
      site.value.id),
    { lastUpdate: serverTimestamp(), latestPages: latestPages }
  )
}

async function deletePage (): Promise<void> {
  const { site } = useSite()

  await deleteDoc(
    doc(
      getFirestore(),
      'sites',
      site.value.id,
      'pages',
      page.value.id
    )
  )
  // Flush Local state
  activePage.value = new Page()
  if (typeof unsub === 'function') unsub()
}

let unsub:undefined|CallableFunction

/**
 * @param id page id
 */
async function subscribeToPage (siteid:string, pageid:string) {
  // Flush state
  activePage.value = new Page()
  if (typeof unsub === 'function') unsub()

  unsub = onSnapshot(
    doc(
      getFirestore(),
      'sites',
      siteid,
      'pages',
      pageid
    ), (pageDoc) => {
      if (pageDoc.exists()) {
        activePage.value = new Page(pageDoc.id, pageDoc.data())
      } else {
        activePage.value = new Page()
      }
    })
}

export function usePage (siteid?:string, pageid?:string): {
  page: ComputedRef<Page>
  deletePage: () => Promise<void>
  } {
  if (siteid && pageid) {
    subscribeToPage(siteid, pageid)
  }
  return { page, deletePage }
}
