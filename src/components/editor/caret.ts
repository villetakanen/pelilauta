/**
 * TS Module for caret position getting and setting for Elements
 */

/**
 * A type inference helper for vetur
 */
interface RangePosition {
  node: Node|null;
  offset: number;
}

/**
 * Walks through the $current element and it's childNodes to find params for
 * 'range.setEnd(node, offset)
 * @param current
 * @param offset
 * @param parent
 */
export function findCaret (current: Node, offset: number, parent?: Node): RangePosition {
  console.log('findFocus for', offset, current, parent)
  // this is the parent
  if (!parent) parent = current
  // this is not parent, so if this is a DIV, we need to walk one step forwards for /n
  else if ((current as Element).tagName === 'DIV') offset--

  // if we hve no offset left, the cursor is att the beginning of this element
  if (offset < 1) return { node: current, offset: 0 }

  // We are walking through a text node
  if (current.nodeType === Node.TEXT_NODE) {
    if (current.textContent && current.textContent.length < offset - 1) {
      // its not this, lets deduct length of this from searched, and pass
      offset -= current.textContent.length
      console.log('text', current, offset)
      return { node: null, offset }
    } else {
      // It's this, lets return this and offset from the start of this text node
      return { node: current, offset }
    }
  }

  // We are in an Element, so we need to walk through children to see if the
  // selection is in one of them
  let node: Node|null = null
  // We are not in text
  for (let lp = 0; lp < current.childNodes.length; lp++) {
    const { node: n, offset: o } = findCaret(current.childNodes[lp], offset, parent)
    offset = o
    if (n) {
      // the call to findFocus above found the focus element, so we can stop
      // the loop and return the  offset and Bode from that node
      node = n
      break
    }
  }
  console.log('findFocus is returning', offset, node)
  return { node, offset }
}

/**
 * Sets selection start and end to given text-position of the element,
 * by walking through the dom node contents of the element
 *
 * @param element the parent element, where the text content is
 * @param offset the amount of letters to offset from the start of this element
 */
export function setCaret (element: HTMLElement, offset: number) {
  const selection = document.getSelection()
  if (!selection || offset < 0) return

  const range = new Range()

  const { node: focusNode, offset: focusNodeOffset } = findCaret(element, offset)
  if (!focusNode) return

  range.setStart(focusNode, focusNodeOffset)
  range.setEnd(focusNode, focusNodeOffset)

  selection.removeAllRanges()
  selection.addRange(range)
}
