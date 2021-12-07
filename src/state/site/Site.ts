import { logDebug } from '@/utils/eventLogger'
import { DocumentData, Timestamp } from '@firebase/firestore'
import { Storable, StorableDoc } from '../Storable'
import { PageCategory } from './PageCategory'

interface PageLogEntry {
  name: string
  id: string
  author: string
}

/**
 * Site specific extra fields we want to store in Firestore, with types.
 */
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
  latestPages?: PageLogEntry[]
  pageCategories?: PageCategory[]
}

export interface SiteModel extends SiteDoc {
  name: string
  description: string
  owners: string[]
  players: string[]
  usePlayers: boolean
  hidden: boolean
  system: string
  systemBadge: string
  theme: string
  latestPages: PageLogEntry[]
  pageCategories: PageCategory[]
  readonly updatedAt: Timestamp | undefined
  hasOwner: (uid: string) => boolean
  hasPlayer: (uid: string) => boolean
  hasEditor: (uid: string) => boolean
  hasCategories: () => boolean
}

/**
 * A Mekanismi Site object, as a Firestore document.
 *
 * Helper methods are provided for reactive attributes and for converting to/from Firestore DocumentData.
 */
export class Site extends Storable implements SiteModel {
    name = ''
    description = ''
    owners: string[] = []
    players: string[] = []
    usePlayers = false // By default, the Keeper functionality is hidden
    hidden = true // By default, this site is not visible in public listings and search
    system = ''
    private _systemBadge = '' // Deprecated, use system, and theme instead
    theme = ''
    private _latestPages:PageLogEntry[] = []
    private _lastUpdate: Timestamp | undefined
    pageCategories: PageCategory[] = []

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
      data.pageCategories = this.pageCategories.map(c => ({ name: c.name, slug: c.slug }))
      logDebug('Site.docData', data.pageCategories)
      return data
    }

    set docData (doc: DocumentData) {
      super.docData = doc
      this.name = doc.name || ''
      this.description = doc.description || ''
      this.owners = doc.owners || []
      this.players = doc.players || []
      this.usePlayers = doc.usePlayers || false
      this.hidden = doc.hidden as boolean

      if (Array.isArray(doc.latestPages)) this._latestPages = doc.latestPages
      if (Array.isArray(doc.pageCategories)) this.pageCategories = doc.pageCategories
      if (doc.lastUpdate) this._lastUpdate = doc.lastUpdate

      // Backwards compatibility, remove in future when all sites have the system field set
      const s = doc?.system || doc?.systemBadge || ''
      this.system = s
      this._systemBadge = s
      this.theme = s
    }

    get latestPages (): PageLogEntry[] {
      return this._latestPages
    }

    get updatedAt (): Timestamp | undefined {
      logDebug('updatedAt', this._lastUpdate, super.updatedAt)
      const d = super.updatedAt
      if (typeof d === 'undefined') return this._lastUpdate
      return d
    }

    get createdAt (): Timestamp | undefined {
      return super.createdAt
    }

    get systemBadge (): string {
      logDebug('Site.systemBadge is deprecated, use Site.system and Site.theme instead')
      return this._systemBadge
    }

    set systemBadge (s:string) {
      logDebug('Site.systemBadge is deprecated, use Site.system and Site.theme instead')
      this._systemBadge = s
      this.theme = s
      this.system = s
    }

    hasOwner (uid:string): boolean {
      return Array.isArray(this.owners) && this.owners.includes(uid)
    }

    hasPlayer (uid:string): boolean {
      return this.players && this.players.includes(uid)
    }

    hasEditor (uid:string): boolean {
      return this.hasOwner(uid) || this.hasPlayer(uid)
    }

    hasCategories (): boolean {
      return Array.isArray(this.pageCategories) && this.pageCategories.length > 0
    }
}
