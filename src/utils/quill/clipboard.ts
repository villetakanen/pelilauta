import Quill from 'quill'
import Delta from 'quill-delta'

export function hoistClipboardConfig (quill:Quill): void {
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
