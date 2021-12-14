import { DocumentData } from '@firebase/firestore'
import { Storable, StorableDoc, StorableModel } from './Storable'

export interface ThreadDoc extends StorableDoc{
  name?: string
}

export interface ThreadModel extends StorableModel{
  name: string
}

export class Thread extends Storable implements StorableModel {
  name = ''
  constructor (thread: ThreadDoc|string, doc?: ThreadDoc) {
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
  }
}
