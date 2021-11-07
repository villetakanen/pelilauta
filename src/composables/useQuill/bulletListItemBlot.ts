import Quill from 'quill'
import { Blot } from 'parchment/dist/src/blot/abstract/blot'

const Container = Quill.import('blots/container')
const Block = Quill.import('blots/block')

export class UlContainer extends Container {}
UlContainer.blotName = 'list-container'
UlContainer.tagName = 'UL'

export class ListItem extends Block {
  static create (): Blot {
    const node = super.create()
    return node
  }

  static formats (domNode:HTMLElement): string|undefined {
    return domNode.getAttribute('level') || undefined
  }

  static register (): void {
    Quill.register(UlContainer)
  }

  format (name: string, value: string): void {
    if (name === this.statics.blotName && value) {
      this.domNode.setAttribute('level', value)
    } else {
      super.format(name, value)
    }
  }
}

ListItem.blotName = 'list'
ListItem.tagName = 'LI'

UlContainer.allowedChildren = [ListItem]
ListItem.requiredContainer = UlContainer
