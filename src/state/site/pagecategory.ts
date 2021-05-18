import { toMekanismiURI } from '@/utils/contentFormat'

export class PageCategory {
  readonly slug: string
  readonly name: string

  public constructor (newName: string, newSlug?: string) {
    this.name = newName
    this.slug = newSlug || toMekanismiURI(newName)
  }
}

export function unmarshallCategories (cats: Array<PageCategory>): {
  slug: string;
  name: string;
}[] {
  return cats.map((cat) => ({ slug: cat.slug, name: cat.name }))
}

export function marshallCategories (cats: { slug: string; name: string; }[]): Array<PageCategory> {
  return cats.map((cat) => (new PageCategory(cat.name, cat.slug)))
}

export function defaultCategories (): Array<PageCategory> {
  return [
    new PageCategory('Characters'),
    new PageCategory('Setting'),
    new PageCategory('Rules'),
    new PageCategory('Other')
  ]
}
