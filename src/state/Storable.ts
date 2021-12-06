import { DocumentData, Timestamp, serverTimestamp } from '@firebase/firestore'

/**
 * A class that can be stored in Firestore. We expect each document to have a createdAt and updatedAt field.
 */
export interface StorableDoc {
  id: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

/**
 * A helper superclass for business entities storable to Firestore as docs.
 */
export class Storable implements StorableDoc {
  private _id: string
  private _created: Timestamp|undefined
  private _updated: Timestamp|undefined

  constructor (storable: string|StorableDoc, doc?: DocumentData) {
    if (typeof storable === 'string') {
      this._id = storable
      if (doc) this.docData = doc
      return
    }
    this._id = storable?.id || ''
    this.docData = storable
  }

  get id (): string {
    return this._id
  }

  get createdAt (): Timestamp|undefined {
    return this._created
  }

  get updatedAt (): Timestamp|undefined {
    return this._updated
  }

  get docData (): DocumentData {
    const data: DocumentData = {
      created: serverTimestamp(),
      updated: serverTimestamp()
    }
    if (this._created) data.created = this._created

    return data
  }

  set docData (doc: DocumentData) {
    if (doc.updated) this._updated = doc.updated
  }

  compareChangeTime (other:Storable): number {
    if (!other.updatedAt) return 1 // other site has no lastUpdate, this is more recent
    if (!this.updatedAt) return -1 // this site has no lastUpdate, other is more recent
    if (other.updatedAt.toMillis() > this.updatedAt.toMillis()) {
      return -1
    }
    return 1
  }
}
