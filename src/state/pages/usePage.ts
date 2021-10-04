import { ref, computed, ComputedRef } from 'vue'
import { Timestamp, DocumentData, serverTimestamp, addDoc, onSnapshot, doc, collection, getFirestore } from '@firebase/firestore'
import { useAuth } from '../authz'
import { useSite } from '../site'

export class Page {
  id:string // Firebase object id for the entity. Empty string on a new Page
  name:string // Mandatory field from UX perspective
  htmlContent:string // Contents of the page, in HTML format
  author:string // a firebase owner for the new page
  lastUpdate: Timestamp|null //

  constructor (id?:string, data?:DocumentData) {
    this.id = id || ''
    this.name = data?.name || ''
    this.htmlContent = data?.htmlContent || ''
    this.author = data?.author || ''
    this.lastUpdate = data?.lastUpdate || null
  }

  dry ():DocumentData {
    return {
      name: this.name,
      htmlContent: this.htmlContent,
      author: this.author,
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
  } {
  if (siteid && pageid) {
    subscribeToPage(siteid, pageid)
  }
  return { page }
}
