import { DocumentData } from '@firebase/firestore'
import { Storable, StorableModel } from './Storable'

export interface ThreadModel extends StorableModel{
  name: string
  author: string
  replyCount: number
  lovedCount: number
  seenCount: number
  hidden: boolean
  content: string
  site?: string
}

export class Thread extends Storable implements StorableModel {
  name = ''
  author = ''
  replyCount = 0
  lovedCount = 0
  seenCount = 0
  hidden = true
  content = '<p><br/><p>'
  site:string|undefined // the id of a game or site linked to this thread

  constructor (thread: DocumentData|string, doc?: DocumentData) {
    super(thread, doc)
    const t = typeof thread === 'string' ? doc || { id: thread } : thread
    this.docData = t
  }

  get docData (): DocumentData {
    const doc = super.docData
    doc.name = this.name
    return doc
  }

  set docData (doc: DocumentData) {
    super.docData = doc
    this.name = doc.name || ''
    this.author = doc.author || ''
    this.replyCount = doc.replyCount || 0
    this.lovedCount = doc.lovedCount || 0
    this.seenCount = doc.seenCount || 0
    this.hidden = !!doc.hidden
    this.content = doc.content || '<p><br/><p>'
    this.site = doc.site || undefined
  }
}
