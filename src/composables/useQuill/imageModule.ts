import Quill from 'quill'
import { ImageBlot, ImageProps } from './imageBlot'

export const IMAGE_UPLOAD_EVENT = 'pelilauta-show-insert-media-dialog'
export const IMAGE_TAG_INSERT_EVENT = 'pelilauta-insert-image-tag-to-delta'

const Module = Quill.import('core/module')

export class ImageModule extends Module {
  static _init = false
  constructor (quill:Quill) {
    super(quill)
    console.log('Registering imageModule')
    document.addEventListener(IMAGE_TAG_INSERT_EVENT, (e) => {
      console.debug('IMAGE_TAG_INSERT_EVENT')
      e.preventDefault()
      const selection = quill.getSelection()
      const ce = e as CustomEvent
      injectTag(
        quill,
        {
          url: ce.detail.url,
          alt: ce.detail.alt
        }, selection?.index
      )
    })
    if (!this._init) {
      this._init = true
      Quill.register(ImageBlot)
    }
  }
}

function injectTag (quill:Quill, target: ImageProps, index = 0): void {
  quill.insertText(index, '\n', Quill.sources.USER)
  quill.insertEmbed(index + 1, 'image', target, Quill.sources.USER)
  quill.setSelection(index + 2, 0, Quill.sources.SILENT)
}
