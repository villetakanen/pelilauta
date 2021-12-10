import { DocumentData } from '@firebase/firestore'
import ddCharSheet from './ddCharSheet.json'
import basicCharacterSheet from './basicCharacterSheet.json'
import { CharacterSheet } from 'charna/lib/CharacterSheet'
import { SheetModel } from 'charna/lib/models/SheetModel'
import { logDebug } from '@/utils/eventLogger'

export interface CharacterStatModel {
  label?: {
    [key: string]: string
  },
  type: string,
  min?: number,
  max?: number,
  formula?: string
}
export interface CharacterStat {
  [key: string]: number|string
}

export const CHARACTER_SHEET_TYPES:{ [key: string]: SheetModel } = {
  default: basicCharacterSheet,
  dd: ddCharSheet
}

export class Character extends CharacterSheet {
  public player: string|undefined
  public name: string
  public site: string|undefined
  public characterSheetType: string
  public avatarURL: string|undefined

  constructor (id?: string, data?:DocumentData) {
    logDebug('Character.constructor', id, data)
    super(id || '')
    this.player = data?.player || undefined
    this.name = data?.name || 'N.N.'
    this.site = data?.site || undefined
    this.characterSheetType = data?.characterSheetType || 'default'
    this.avatarURL = data?.avatarURL || undefined
    this.model = CHARACTER_SHEET_TYPES[this.characterSheetType] || basicCharacterSheet
    this.ingestStats(data?.stats || {})
  }

  ingestStats (stats: { [key: string]: number|string }): void {
    Object.keys(stats).forEach(k => {
      logDebug('Character.ingestStats', k, stats[k])
      // if there is a forumula, the stat is composite and can not be set directly
      if (!super.model.stats[k].formula) this.setStat(k, stats[k])
    })
  }

  public dryCopy (): { [x: string]: string|CharacterStat } {
    const dry: { [x: string]: undefined|string|CharacterStat } = {
      ...this.toJSON(),
      name: this.name,
      site: this.site,
      characterSheetType: this.characterSheetType,
      player: this.player,
      avatarURL: this.avatarURL
    }
    Object.keys(dry).forEach(k => dry[k] === undefined ? delete dry[k] : null)
    return dry as { [x: string]: string|CharacterStat }
  }
}
