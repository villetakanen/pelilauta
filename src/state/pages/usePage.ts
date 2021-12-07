import { ref, computed, ComputedRef, Ref } from 'vue'
import { serverTimestamp, addDoc, onSnapshot, doc, collection, getFirestore, updateDoc, deleteDoc, DocumentData } from '@firebase/firestore'
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

export async function savePage (updatedPage:PageModel): Promise<void> {
  const { site } = useSite()
  const { user } = useAuth()

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

  const data = updatedPage.docData as DocumentData
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
  return updateDoc(
    doc(
      getFirestore(),
      'sites',
      site.value.id),
    {
      updatedAt: serverTimestamp(),
      latestPages: latestPages
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
  } {
  if (siteid && pageid) {
    subscribeToPage(siteid, pageid)
  }
  return { page, deletePage }
}
