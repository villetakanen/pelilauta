import { DocumentData, Timestamp, serverTimestamp } from '@firebase/firestore'

export interface StorableDoc {
  id: string
  created?: Timestamp
  updated?: Timestamp
}

/**
 * A helper superclass for entities storable to Firestone
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

  get created (): Timestamp|undefined {
    return this._created
  }

  get updated (): Timestamp|undefined {
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
    if (!other.updated) return 1 // other site has no lastUpdate, this is more recent
    if (!this.updated) return -1 // this site has no lastUpdate, other is more recent
    if (other.updated.toMillis() > this.updated.toMillis()) {
      return -1
    }
    return 1
  }
}
