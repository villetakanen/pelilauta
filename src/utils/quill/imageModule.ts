import Quill from 'quill'
import { logDebug } from '../eventLogger'

export const IMAGE_UPLOAD_EVENT = 'pelilauta-show-insert-media-dialog'
export const IMAGE_TAG_INSERT_EVENT = 'pelilauta-insert-image-tag-to-delta'

const Module = Quill.import('core/module')

export class ImageModule extends Module {
  private quill:Quill
  constructor (quill:Quill) {
    super(quill)
    this.quill = quill
  }

  addImageTag (img: { url: string, alt: string}): void {
    logDebug('ImageModule.addImageTag')
    const index = this.quill.getSelection()?.index || 0
    // Add the image tag with event params)
    this.quill.insertText(
      index,
      '\n',
      Quill.sources.USER
    )
    this.quill.insertEmbed(
      index + 1,
      'image',
      img,
      Quill.sources.USER
    )
    this.quill.setSelection(
      index + 2,
      0,
      Quill.sources.SILENT
    )
  }

  postInstall (): void {
    const toolbar = this.quill.getModule('toolbar')
    toolbar.addHandler('image', () => {
      document.dispatchEvent(new Event(IMAGE_UPLOAD_EVENT))
    })
  }
}
