import { DocumentData, Timestamp } from '@firebase/firestore'

export interface SiteData {
  id?: string
  name?: string
  description?: string
  owners?: string[]
  players?: string[]
  usePlayers?: boolean
  hidden?: boolean
  system?: string
  systemBadge?: string
  lastUpdate?: Timestamp
}

export class Site {
    id: string
    name: string
    description: string
    owners: string[]
    players: string[]
    usePlayers: boolean
    hidden: boolean
    system: string
    systemBadge: string
    lastUpdate?: Timestamp

    constructor (site: string|SiteData = '', data?: SiteData) {
      const d = typeof site !== 'string' ? site : data ? { id: site, ...data } : { id: site }

      this.id = d.id || ''
      this.name = d.name || ''
      this.description = d.description || ''
      this.owners = d.owners || []
      this.players = d.players || []
      this.usePlayers = d.usePlayers || false
      this.hidden = d.hidden || false

      // Optional fields
      if (d.lastUpdate) this.lastUpdate = d.lastUpdate

      // Backwards compatibility, remove in future when all sites have the system field set
      const s = d?.system || d?.systemBadge || ''
      this.system = s
      this.systemBadge = s
    }

    static fromDocumentData (data:DocumentData): Site {
      return new Site(data as SiteData)
    }

    toJSON (): SiteData {
      const s:SiteData = {
        id: this.id,
        name: this.name,
        description: this.description,
        owners: this.owners,
        players: this.players,
        usePlayers: this.usePlayers,
        hidden: this.hidden,
        system: this.system,
        systemBadge: this.systemBadge
      }
      if (this.lastUpdate) s.lastUpdate = this.lastUpdate
      return s
    }

    isOwner (uid:string): boolean {
      if (this.owners && this.owners.includes(uid)) {
        return true
      }
      return false
    }

    canEdit (uid:string): boolean {
      if (this.owners && this.owners.includes(uid)) {
        return true
      }
      if (this.players && this.players.includes(uid)) {
        return true
      }
      return false
    }

    compareChangeTime (other:Site): number {
      if (!other.lastUpdate) return 1 // other site has no lastUpdate, this is more recent
      if (!this.lastUpdate) return -1 // this site has no lastUpdate, other is more recent
      if (other.lastUpdate.toMillis() > this.lastUpdate.toMillis()) {
        return -1
      }
      return 1
    }
}
