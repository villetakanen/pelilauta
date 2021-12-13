import { ref, computed, ComputedRef, Ref } from 'vue'
import { serverTimestamp, addDoc, onSnapshot, doc, collection, getFirestore, updateDoc, deleteDoc, DocumentData, getDoc, setDoc } from '@firebase/firestore'
import { useAuth } from '../authz'
import { useSite } from '../site'
import { Page, PageDoc, PageModel } from './Page'

const activePage:Ref<PageModel> = ref(new Page())
const page = computed(() => (activePage.value))

export async function createPage (data:PageDoc): Promise<string> {
  console.debug('createPage', data)

  const page = new Page('', data)

  // As we are creating a new page, force the creator to be the
  // current user!
  if (page.author) console.warn('Trying to create a page with pre-set author -> page author set to current user')
  const { user } = useAuth()
  page.author = user.value.uid

  const { site } = useSite()
  const createdDoc = await addDoc(
    collection(
      getFirestore(),
      'sites',
      site.value.id,
      'pages'
    ),
    page.docData
  )
  return createdDoc.id
}

export interface PageLogEntry {
  id: string,
  name: string,
  author: string
}

/**
 * Patches a PageLofEntry to the last 5 entries table
 */
function patchEntry (pages: Array<PageLogEntry>, entry: PageLogEntry): Array<PageLogEntry> {
  const index = pages.findIndex(p => p.id === entry.id)
  if (index === -1) {
    pages.pop()
  } else {
    pages.splice(index, 1)
  }
  return [entry, ...pages]
}

export async function savePage (updatedPage:PageModel): Promise<void> {
  const { site, updateSite } = useSite()
  const { user } = useAuth()

  console.debug('site', site.value, 'page', updatedPage)

  // Adds an entry to site latest pages. This code might belong to cloud functions
  const latest = patchEntry(site.value.latestPages, {
    id: updatedPage.id,
    name: updatedPage.name,
    author: user.value.uid
  })
  // End latest pages entry code, it's updated to site data below

  const data = updatedPage.docData
  // create timestamps are supported at release 12.3.0 and above
  if (!data.created) data.created = serverTimestamp()
  data.updatedAt = serverTimestamp()

  await updateDoc(
    doc(
      getFirestore(),
      'sites',
      site.value.id,
      'pages',
      updatedPage.id
    ),
    data
  )
  return updateSite(
    {
      updatedAt: serverTimestamp(),
      latestPages: latest
    }
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

async function movePage (newSite:string): Promise<void> {
  const { site } = useSite()
  const { user } = useAuth()
  const pageid = page.value.id

  const pageDoc = await getDoc(doc(getFirestore(), 'sites', site.value.id, 'pages', pageid))
  const dpage = new Page(pageid, pageDoc.data() as PageDoc)
  const data = dpage.docData
  data.updatedAt = serverTimestamp()
  data.updatedBy = user.value.uid

  await setDoc(
    doc(getFirestore(), 'sites', newSite, 'pages', pageid), data
  )
  await updateDoc(
    doc(getFirestore(), 'sites', newSite), { updatedAt: serverTimestamp() }
  )
  await deleteDoc(
    doc(getFirestore(), 'sites', site.value.id, 'pages', pageid)
  )
  await updateDoc(
    doc(getFirestore(), 'sites', site.value.id), { updatedAt: serverTimestamp() }
  )
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
        activePage.value = new Page(pageDoc.id, pageDoc.data() as PageDoc)
      } else {
        activePage.value = new Page()
      }
    })
}

export function usePage (siteid?:string, pageid?:string): {
  page: ComputedRef<PageModel>
  deletePage: () => Promise<void>
  movePage: (newSite:string) => Promise<void>
  } {
  if (siteid && pageid) {
    subscribeToPage(siteid, pageid)
  }
  return { page, deletePage, movePage }
}
