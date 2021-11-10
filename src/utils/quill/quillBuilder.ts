import { ImageBlot } from '@/composables/useQuill/imageBlot'
import Quill from 'quill'
import { logDebug } from '../eventLogger'
import { AuthorLinkBlot, MentionBlot } from './mentionBlot'
import { MentionsModule } from './mentionsModule'

export class QuillBuilder {
  private static instance: QuillBuilder
  private static defaultFormats = [
    'bold',
    'strike',
    'underline',
    'italic',
    'image',
    'blockquote',
    'authorlink',
    'mention'
  ]

  private static _init = false

  private static initialize () {
    if (QuillBuilder._init) return
    QuillBuilder._init = true

    Quill.register('formats/mention', MentionBlot)
    Quill.register('formats/authorlink', AuthorLinkBlot)
    Quill.register('formats/image', ImageBlot)

    Quill.register('modules/mention', MentionsModule)
    logDebug('QuillBuilder init')
  }

  public static create (container: HTMLElement, formats?: string[]): Quill {
    QuillBuilder.initialize()
    const configuration = {
      formats: formats || QuillBuilder.defaultFormats,
      modules: {
        mention: true
      }
    }
    return new Quill(container, configuration)
  }
}
