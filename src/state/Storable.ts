/**
 * A helper superclass for entities storable to Firestone
 */
export class Storable {
  private _id: string
  
  constructor (id: string) {
    this._id = id
  }

  get id (): string {
    return this._id
  }

  get docData(): {} {
    console.error('docData getter must be overridden')
    return {}
  }

  set docData (doc: DocumentData) {
    console.error('docData setter must be overridden')
  }
}
