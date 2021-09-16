import Quill from 'quill'

const InlineBlot = Quill.import('blots/inline')

class WikiLinkBlot extends InlineBlot {
  static blotName = 'wikilink'
  static className = 'rt-wikilink'
  static tagName = 'a'

  static create (url: unknown) {
    const node = super.create()
    // This should likely be onClick="window.location.href=..." for routing instead of href attr.
    console.log('create link', url)
    if (typeof url === 'string') {
      node.setAttribute('href', url)
    }
    // Okay to set other non-format related attributes
    // These are invisible to Parchment so must be static
    node.setAttribute('target', '_top')
    return node
  }

  static formats (node:Element) {
    return {
      href: node.getAttribute('href')
    }
  }
}

export function wikiLinkModule (quill:Quill): void {
  console.log('hoisting the WikilinkModule')

  let start = 0
  let length = 0

  function addWikiLink (range: unknown) {
    console.warn('addWikiLink', range)

    start = quill.getSelection()?.index ?? 0
    length = quill.getSelection()?.length ?? 0

    const format = quill.getFormat(start) as Record<string, unknown>
    if (format.wikilink) return

    document.dispatchEvent(new Event('rte-wikilink-tool'))

    return true
  }

  document.addEventListener('rte-post-link', (value) => {
    console.log('rte-post-link', value, start, length, value)
    const detail = (value as CustomEvent).detail
    quill.insertText(start, detail?.text)
    quill.formatText(start, (detail?.text.length) ?? 1, { wikilink: detail?.url ?? '' }, Quill.sources.API)
  })

  Quill.register(WikiLinkBlot)
  quill.keyboard.addBinding({ key: 'k', shortKey: true }, addWikiLink)
}
