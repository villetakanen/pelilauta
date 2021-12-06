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

  get data (): {} {
    return {}
  }
}
