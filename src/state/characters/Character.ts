import { DocumentData } from '@firebase/firestore'

export class Character {
  readonly id: string
  public player: string|undefined
  public name: string
  public htmlDescription: string
  public site: string|undefined

  constructor (id: string, data?:DocumentData) {
    this.id = id
    this.player = data?.player ?? undefined
    this.name = data?.name ?? 'N.N.'
    this.htmlDescription = data?.htmlDescription ?? ''
    this.site = data?.site ?? undefined
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
