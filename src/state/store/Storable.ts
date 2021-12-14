import { DocumentData, Timestamp, serverTimestamp } from '@firebase/firestore'

/**
 * Field typings for the Storable DocumentData
 */
export interface StorableDoc {
  id?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
  flowTime?: number
}

/**
 * Shape of the Storable class
 */
export interface StorableModel {
  id: string
  createdAt: Timestamp | undefined
  updatedAt: Timestamp | undefined
  flowTime: number
  compareFlowTime: (other: StorableModel) => number
  compareChangeTime: (other: StorableModel) => number
}

/**
 * A helper superclass for business entities storable to Firestore as docs.
 */
export class Storable implements StorableModel {
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

  /**
   * Return the contents of this entity as a storable Firestore document. UpdatedAt will be set
   * to the current time by Firestore, as the entity is stored. CreatedAt is set to the value it has,
   * or to the current time by Firestore if it is undefined.
   *
   * For entities with flowTime, the flowTime will be to current time by the Firestore.
   *
   * Child classes should override this method to add their own fields to the document. The override should
   * start with `const dataToBeReturned = super.docData()` and then add any fields to the returned object.
   *
   * @returns {DocumentData} The contents of this entity as a storable Firestore document.
   */
  get docData (): DocumentData {
    const data: DocumentData = {}
    data.created = this._created || serverTimestamp()
    data.updated = serverTimestamp()

    // We will not inject the flowTime to entities that do not use flowtime.
    if (this._flowTime) data.flowTime = this._flowTime
    return data
  }

  set docData (doc: DocumentData) {
    if (doc.created) this._created = doc.created
    if (doc.updated) this._updated = doc.updated
    if (doc.flowTime) this._flowTime = (doc.flowTime as Timestamp)
  }

  compareFlowTime (other:StorableModel): number {
    if (other.id === this.id) return 0 // They are the same entity, return 0
    if (other.flowTime > this.flowTime) {
      return -1
    }
    return 1
  }

  compareChangeTime (other:StorableModel): number {
    if (!other.updatedAt) return 1 // other site has no lastUpdate, this is more recent
    if (!this.updatedAt) return -1 // this site has no lastUpdate, other is more recent
    if (other.updatedAt.toMillis() > this.updatedAt.toMillis()) {
      return -1
    }
    return 1
  }
}
