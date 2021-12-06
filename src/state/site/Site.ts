import { DocumentData } from '@firebase/firestore'
import { Storable, StorableDoc } from '../Storable'

export interface SiteDoc extends StorableDoc {
  name?: string
  description?: string
  owners?: string[]
  players?: string[]
  usePlayers?: boolean
  hidden?: boolean
  system?: string
  systemBadge?: string
  theme?: string
}

export class Site extends Storable {
    name = ''
    description = ''
    owners: string[] = []
    players: string[] = []
    usePlayers = false
    hidden = true
    system = ''
    systemBadge = ''
    theme = ''

    constructor (site: string|SiteDoc = '', data?: SiteDoc) {
      super(site as StorableDoc, data)
      const d:SiteDoc = typeof site !== 'string' ? site : data ? { ...data } : { id: site }

      this.docData = d
    }

    get docData (): DocumentData {
      const data = super.docData
      data.name = this.name
      data.description = this.description
      data.owners = this.owners
      data.players = this.players
      data.usePlayers = this.usePlayers
      data.hidden = this.hidden
      data.system = this.system
      data.systemBadge = this.systemBadge
      return data
    }

    set docData (doc: DocumentData) {
      super.docData = doc
      this.name = doc.name || ''
      this.description = doc.description || ''
      this.owners = doc.owners || []
      this.players = doc.players || []
      this.usePlayers = doc.usePlayers || false
      this.hidden = doc.hidden || false

      // Backwards compatibility, remove in future when all sites have the system field set
      const s = doc?.system || doc?.systemBadge || ''
      this.system = s
      this.systemBadge = s
      this.theme = s
    }

    hasOwner (uid:string): boolean {
      return this.owners && this.owners.includes(uid)
    }

    hasPlayer (uid:string): boolean {
      return this.players && this.players.includes(uid)
    }

    hasEditor (uid:string): boolean {
      return this.hasOwner(uid) || this.hasPlayer(uid)
    }
}
