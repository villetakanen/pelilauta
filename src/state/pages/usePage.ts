import { ref, computed, ComputedRef } from 'vue'
import { Timestamp, DocumentData, serverTimestamp, addDoc, collection, getFirestore } from '@firebase/firestore'
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

  const { user } = useAuth()
  newPage.author = user.value.uid

  const { site } = useSite()
  const page = await addDoc(
    collection(
      getFirestore(),
      'sites',
      site.value.id,
      'pages'
    ),
    newPage.dry()
  )
  return page.id
}

export function usePage (id?:string): {
  page: ComputedRef<Page>
  } {
  if (!id) {
    if (activePage.value.id) {
      activePage.value = new Page()
    }
  }
  return { page }
}
