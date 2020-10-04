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

function nodeWalk (node: Node, func: Function) {
  let result = func(node)
  for (node = node.firstChild as Element; result !== false && node; node = node.nextSibling as Element) {
    result = nodeWalk(node, func)
  }
  return result
}

export function getCaretOffset (current: HTMLElement): number {
  const selection = window.getSelection()
  let offset = 0

  if (selection === null) return 0

  if (selection.anchorNode === current) return selection.anchorOffset

  const nodeToFind = selection.anchorNode

  if (!current.contains(nodeToFind)) return 0

  let found = false
  nodeWalk(current, (node: Node) => {
    if (found) return
    // DIV, add offset++ for /n
    if (!node.isSameNode(current) && (node as Element).tagName === 'DIV') offset++
    if (node.isSameNode(nodeToFind)) {
      found = true
      return
    }
    if (node.textContent && !node.firstChild) {
      offset += node.textContent.length
    }
  })
  offset += selection.anchorOffset
  // if ((nodeToFind as Element).tagName === 'DIV') offset--
  console.info('###', offset, '###')
  return offset
}

/**
 * Walks through the $current element and it's childNodes to find params for
 * 'range.setEnd(node, offset)
 * @param current
 * @param offset
 * @param parent
 */
export function findCaret (current: Node, offset: number, parent?: Node): RangePosition {
  console.log('findFocus for', offset, current)
  // this is the parent
  if (!parent) parent = current
  // this is not parent, so if this is a DIV, we need to walk one step forwards for /n
  else if ((current as Element).tagName === 'DIV') {
    if (!current.textContent || current.textContent) { offset-- }
  }

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
    console.log('looping', current.childNodes[lp])
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
 * Usage:
 * const { offset } = getCaret(el)
 * el.innerHTML = (el.innerHTML as string).toLowerCase()
 * setCaret(el, offset)
 *
 * @param element the parent element, where the text content is
 * @param offset the amount of letters to offset from the start of this element
 */
export function setCaret (element: Element, offset: number) {
  const selection = document.getSelection()
  if (!selection || offset < 0) return

  const range = new Range()

  // const { node: focusNode, offset: focusNodeOffset } = findCaret(element, offset)

  let focusNode = element
  let focusNodeOffset = offset
  let found = false
  nodeWalk(element, (node: Element) => {
    if (found) return
    console.log('traversing', node, focusNodeOffset, node.nodeType === Node.TEXT_NODE, node.textContent)
    if (!node.isSameNode(element) && node.tagName === 'DIV') focusNodeOffset--
    // Caret needs to go to the beginning of this node
    if ((focusNodeOffset) < 1) {
      focusNode = node
      found = true
      return
    }
    if (node.nodeType === Node.TEXT_NODE && node.textContent) {
      if (node.textContent.length > focusNodeOffset - 1) {
        console.log('found!')
        focusNode = node
        found = true
      } else {
        focusNodeOffset -= node.textContent.length
      }
    }
  })

  range.setStart(focusNode, focusNodeOffset)
  range.setEnd(focusNode, focusNodeOffset)

  selection.removeAllRanges()
  selection.addRange(range)
}
