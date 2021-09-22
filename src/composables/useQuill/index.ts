import { wikiLinkModule } from '@/utils/quill/wikiLinkModule'
import Quill, { QuillOptionsStatic } from 'quill'
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

export default function useQuill (container: Element, options?: QuillOptionsStatic | undefined): Quill {
  const q = new Quill(container, options)
  hoistClipboardConfig(q)
  return q
}
