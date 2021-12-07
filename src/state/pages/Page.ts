import { DocumentData, Timestamp } from '@firebase/firestore'
import { Storable, StorableDoc } from '../Storable'

interface PageDoc extends StorableDoc {
  name?: string
  siteid?: string
  seenCount?: number
  htmlContent?: string
  authors?: string[]
  author?: string
  category?: string
}

interface PageModel extends PageDoc {
  readonly id: string
  readonly createdAt: Timestamp | undefined
  readonly updatedAt: Timestamp | undefined
  docData: DocumentData
  name: string
  siteid: string
  seenCount: number
  htmlContent: string
  authors: string[]
  author: string,
  category: string
}

class Page extends Storable implements PageModel {
  name = ''
  siteid = ''
  seenCount = 0
  htmlContent = ''
  authors: string[] = []
  category = ''

  constructor (page?:string|PageDoc, data?:PageDoc) {
    super(page || '', data)
    const p = typeof page === 'string' ? { id: page } : page
    this.docData = data || p || {}
  }

  /**
   * Backwards compatibility with old data
   */
  get author (): string {
    return this.authors[0] || ''
  }

  /**
   * Backwards compatibility with old data
   */
  set author (author: string) {
    this.authors = [author, ...this.authors.filter(a => a !== author)]
  }

  get docData (): DocumentData {
    return {
      name: this.name,
      siteid: this.siteid,
      seenCount: this.seenCount,
      htmlContent: this.htmlContent,
      authors: this.authors,
      category: this.category
    }
  }

  set docData (doc: DocumentData) {
    if (doc.name) this.name = doc.name
    if (doc.siteid) this.siteid = doc.siteid
    if (doc.seenCount) this.seenCount = doc.seenCount
    if (doc.htmlContent) this.htmlContent = doc.htmlContent
    if (doc.authors) this.authors = doc.authors
    if (doc.category) this.category = doc.category
  }
}

export {
  Page,
  PageModel,
  PageDoc
}
