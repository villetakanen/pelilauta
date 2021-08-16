import firebase from 'firebase/app'

export const pcTypes = [
  'default',
  'll'
]

/**
 * A Helper class for PlayerCharacter handling
 */
export default class PlayerCharacter {
  id:string
  name:string
  playerid:string
  type:string
  description:string

  constructor (key: string, data?: firebase.firestore.DocumentData) {
    this.id = key
    this.name = data?.name ?? ''
    this.playerid = data?.name ?? ''
    this.type = pcTypes.includes(data?.type) ? data?.type : pcTypes[0]
    this.description = data?.description ?? ''
  }

  // Return type is implicit from the return statement below
  //
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  toFirebaseStruct () {
    return {
      id: this.id,
      data: {
        name: this.name,
        playerid: this.playerid,
        type: this.type,
        description: this.description
      }
    }
  }
}
