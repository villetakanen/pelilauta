import Quill from 'quill'

const BlockEmbed = Quill.import('blots/block/embed')

export interface ImageProps {
    alt: string|null
    url: string|null
}

export class ImageBlot extends BlockEmbed {
  static blotName = 'image'
  static className = 'rte-embedded-image'
  static tagName = 'img'

  static create (props:ImageBlot): void {
    const node = super.create()
    node.setAttribute('alt', props.alt)
    node.setAttribute('src', props.url)
    return node
  }

  static value (node:Element): ImageProps {
    return {
      alt: node.getAttribute('alt'),
      url: node.getAttribute('src')
    }
  }
}
