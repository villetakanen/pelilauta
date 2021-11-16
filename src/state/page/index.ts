import { DocumentData } from '@firebase/firestore'

export interface Page {
  id: string
  siteid: string
  seenCount: number
}

export class PageClass {
  id: string
  siteid: string
  seenCount: number
  constructor (id:string, data?:Page|DocumentData) {
    this.id = id
    this.siteid = data?.siteid || ''
    this.seenCount = data?.seenCount || 0
  }
}
