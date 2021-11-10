import { ImageBlot } from '@/utils/quill/imageBlot'
import Quill from 'quill'
import { logDebug } from '../eventLogger'
import { ImageModule } from './imageModule'
import { AuthorLinkBlot, MentionBlot } from './mentionBlot'
import { MentionsModule } from './mentionsModule'
import { WikiLinkBlot, WikiLinkModule } from './wikiLinkModule'

export class QuillBuilder {
  private static instance: QuillBuilder
  private static defaultFormats = [
    'bold',
    'italic',
    'image',
    'blockquote',
    'authorlink',
    'mention'
  ]

  private static extendedFormats = [
    ...QuillBuilder.defaultFormats,
    'header',
    'strike',
    'underline',
    'intend',
    'wikilink',
    'list'
  ]

  private static _init = false

  private static initialize () {
    if (QuillBuilder._init) return
    QuillBuilder._init = true

    Quill.register('formats/mention', MentionBlot)
    Quill.register('formats/authorlink', AuthorLinkBlot)
    Quill.register('formats/image', ImageBlot)
    Quill.register('formats/wikilink', WikiLinkBlot)

    Quill.register('modules/mention', MentionsModule)
    Quill.register('modules/image', ImageModule)
    Quill.register('modules/wikilink', WikiLinkModule)
    logDebug('QuillBuilder init')
  }

  public static create (container: HTMLElement, extendedFormats = false): Quill {
    QuillBuilder.initialize()
    const configuration = {
      formats: extendedFormats ? QuillBuilder.extendedFormats : QuillBuilder.defaultFormats,
      options: {
        scrollingContainer: container
      },
      modules: {
        mention: true,
        image: true,
        toolbar: extendedFormats ? { container: '#rte-toolbar' } : undefined,
        wikilink: extendedFormats ? true : undefined
      }
    }
    const q = new Quill(container, configuration)
    if (extendedFormats) {
      q.getModule('image').postInstall()
      q.getModule('wikilink').addHandlers()
    }
    return q
  }
}
