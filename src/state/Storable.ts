import { DocumentData, Timestamp, serverTimestamp } from '@firebase/firestore'

/**
 * A class that can be stored in Firestore. We expect each document to have a createdAt and updatedAt field.
 */
export interface StorableDoc {
  id: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
  flowTime?: number
}

/**
 * A helper superclass for business entities storable to Firestore as docs.
 */
export class Storable implements StorableDoc {
  private _id: string
  private _created: Timestamp|undefined
  private _updated: Timestamp|undefined
  private _flowTime: Timestamp|undefined

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

  /**
   * The time of the last change to this entity, or any related entity within the Update Stream Graph context.
   *
   * @returns {number} The time of the last change to this entity, or any related entity in milliseconds since the epoch.
   */
  get flowTime (): number {
    if (this._flowTime) return this._flowTime.toMillis()
    if (this._updated) return this._updated.toMillis()
    if (this._created) return this._created.toMillis()
    return 0
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
    if (doc.created) this._created = doc.created
    if (doc.updated) this._updated = doc.updated
    if (doc.flowTime) this._flowTime = (doc.flowTime as Timestamp)
  }

  compareFlowTime (other:Storable): number {
    if (other.id !== this.id) return 0 // They are the same entity, return 0
    if (other.flowTime > this.flowTime) {
      return -1
    }
    return 1
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
