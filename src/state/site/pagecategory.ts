import { toMekanismiURI } from '@/utils/contentFormat'

export class PageCategory {
  readonly slug: string
  readonly name: string

  public constructor (newName: string, newSlug?: string) {
    this.name = newName
    this.slug = newSlug || toMekanismiURI(newName)
  }

  static generateDefaultCategories (): Array<PageCategory> {
    return [
      new PageCategory('Characters'),
      new PageCategory('Setting'),
      new PageCategory('Rules'),
      new PageCategory('Other')
    ]
  }
}
