import Quill from 'quill'
import Delta from 'quill-delta'
import { ImageModule, IMAGE_UPLOAD_EVENT } from '@/composables/useQuill/imageModule'
import { wikiLinkModule } from '@/utils/quill/wikiLinkModule'

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

export default function useQuill (container: Element): Quill {
  const config = {
    formats: [
      'bold',
      'strike',
      'underline',
      'italic',
      'wikilink',
      'header',
      'image',
      'list'
    ],
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

  Quill.register('modules/image', ImageModule)
  Quill.register('modules/wikilinks', wikiLinkModule)

  const q = new Quill(container, config)
  hoistClipboardConfig(q)
  return q
}
