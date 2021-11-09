import Quill from 'quill'
import Delta from 'quill-delta'
import { ImageModule, IMAGE_UPLOAD_EVENT } from '@/composables/useQuill/imageModule'
import { wikiLinkModule } from '@/utils/quill/wikiLinkModule'
import { logEvent } from '@/utils/eventLogger'

export function hoistClipboardConfig (quill:Quill): void {
  // Remove all color styles from pasted content by force
  quill.clipboard.addMatcher(Node.ELEMENT_NODE,
    function (node, delta) {
      return delta.compose(new Delta().retain(delta.length(),
        {
          color: false,
          background: false
        }))
    }
  )
}

export class QuillFactory {
  private static instance: QuillFactory
  private static formats = [
    'bold',
    'strike',
    'underline',
    'italic',
    'wikilink',
    'header',
    'image',
    'list'
  ]

  private constructor () {
    Quill.register('modules/image', ImageModule)
    Quill.register('modules/wikilinks', wikiLinkModule)

    logEvent('QuillFactory init complete')
  }

  public static createQuill (container: HTMLElement): Quill {
    if (!QuillFactory.instance) {
      QuillFactory.instance = new QuillFactory()
    }
    const config = {
      formats: this.formats,
      options: {
        scrollingContainer: container
      },
      modules: {
        wikilinks: true,
        image: true,
        toolbar: {
          container: '#rte-toolbar',
          handlers: {
            wikilink: () => {
              document.dispatchEvent(new CustomEvent('rte-wikilink-tool', {
                detail: q.getSelection()?.index
              }))
            },
            image: () => {
              console.debug('dispatching pelilauta-show-insert-media-dialog')
              document.dispatchEvent(new Event(IMAGE_UPLOAD_EVENT))
            }
          }
        }
      }
    }
    const q = new Quill(container, config)
    hoistClipboardConfig(q)
    return q
  }
}

export default function useQuill (container: HTMLElement): Quill {
  return QuillFactory.createQuill(container)
}
