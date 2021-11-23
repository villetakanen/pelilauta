import { logDebug } from '@/utils/eventLogger'
import { DocumentData } from '@firebase/firestore'
import { create, all } from 'mathjs'

export interface CharacterStatModel {
  label?: {
    [key: string]: string
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
  public stats: Map<string, number>
  private math = create(all)

  constructor (id: string, data?:DocumentData) {
    this.id = id
    this.player = data?.player || undefined
    this.name = data?.name || 'N.N.'
    this.htmlDescription = data?.htmlDescription || ''
    this.site = data?.site || undefined
    this.stats = Character.parseStats(data?.stats || {})
  }

  private static parseStats (stats:{ [key: string]: number }): Map<string, number> {
    const result = new Map<string, number>()
    for (const [key, value] of Object.entries(stats)) {
      result.set(key, value)
    }
    return result
  }

  public applyCharacterSheet (characterSheet: CharacterSheetModel): void {
    this.sheet = characterSheet
  }

  public getStat (stat: string): number {
    if (!this.stats.has(stat)) {
      logDebug('Trying to get a stat that´s not defined', stat)
      return 0
    }
    return this.stats.get(stat) || 0
  }

  public getStatLabel (stat: string, code: string): string {
    // logDebug('getStatLabel', stat, code, this.sheet?.stats[stat])
    if (!this.sheet) {
      return stat
    }
    const statModel = this.sheet.stats[stat]
    if (!statModel) {
      return stat
    }
    if (!statModel.label) return stat
    return statModel.label[code] || statModel.label.en || stat
  }

  public setStat (stat: string, value: number): void {
    this.stats.set(stat, value)
  }

  public deriveStat (stat: string): number {
    if (!this.sheet) {
      return 0
    }

    // A primary stat, not derived
    if (this.stats.has(stat)) {
      return this.stats.get(stat) || 0
    }

    const statModel = this.sheet.stats[stat]
    // We do not have a model for this stat, return 0
    if (!statModel) {
      return 0
    }

    // We have a model, but no formula, return 0
    if (!statModel.formula) {
      return 0
    }

    const parser = this.math.parser()
    // We have a formula, let's try to evaluate it
    statModel.formula.split(' ').forEach(v => {
      // logDebug('Parsing', v, this?.sheet?.stats[v]?.type)
      if (this?.sheet?.stats[v]?.type === 'number') parser.set(v, this.getStat(v) || 0)
    })
    // logDebug('Composite stats', parser.getAll(), statModel.formula)
    const result = parser.evaluate(statModel.formula) || 0

    // logDebug('deriveStat', result, statModel.formula)

    return Math.floor(result)
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
