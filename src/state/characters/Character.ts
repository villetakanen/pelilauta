import { DocumentData } from '@firebase/firestore'

export interface CharacterStatModel {
  label?: {
    en?: string
    fi?: string
  },
  type: string,
  min?: number,
  max?: number,
  formula?: string
}

export interface CharacterSheetModel {
  layout: Array<string|Array<string>>
  stats: {
    [key: string]: CharacterStatModel
  }
}

export class Character {
  readonly id: string
  public player: string|undefined
  public name: string
  public htmlDescription: string
  public site: string|undefined
  public sheet: CharacterSheetModel|undefined
  public stats: Array<CharacterStatModel>

  constructor (id: string, data?:DocumentData) {
    this.id = id
    this.player = data?.player || undefined
    this.name = data?.name || 'N.N.'
    this.htmlDescription = data?.htmlDescription || ''
    this.site = data?.site || undefined
    this.stats = data?.stats || []
  }

  public applyCharacterSheet (characterSheet: CharacterSheetModel): void {
    this.sheet = characterSheet
  }

  public dryCopy (): {
      id: string,
      name: string,
      htmlDescription: string
      site: string|undefined
        player: string|undefined
        } {
    return {
      id: this.id,
      name: this.name,
      htmlDescription: this.htmlDescription,
      site: this.site,
      player: this.player
    }
  }
}
