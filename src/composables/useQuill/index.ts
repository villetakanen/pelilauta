import { wikiLinkModule } from '@/utils/quill/wikiLinkModule'
import Quill from 'quill'
import Delta from 'quill-delta'

// Implement and register module
Quill.register('modules/wikilinks', wikiLinkModule)

function hoistClipboardConfig (quill:Quill) {
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
      'header'
    ],
    modules: {
      wikilinks: true,
      toolbar: {
        container: '#rte-toolbar',
        handlers: {
          wikilink: () => {
            document.dispatchEvent(new CustomEvent('rte-wikilink-tool', {
              detail: q.getSelection()?.index
            }))
          }
        }
      }
    }
  }

  const q = new Quill(container, config)
  hoistClipboardConfig(q)
  return q
}
