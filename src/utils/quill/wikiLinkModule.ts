import Quill from 'quill'

const InlineBlot = Quill.import('blots/inline')

export class WikiLinkBlot extends InlineBlot {
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
  console.log('Registering WikilinkModule')

  function addWikiLink (range: unknown) {
    console.warn('addWikiLink', range)

    const format = quill.getFormat(quill.getSelection() || undefined) as Record<string, unknown>
    if (format.wikilink) return

    document.dispatchEvent(new Event('rte-wikilink-tool'))

    return true
  }

  document.addEventListener('rte-post-link', (value) => {
    const selection = quill.getSelection() || { index: 0, length: 0 }
    console.log('rte-post-link', value)
    const detail = (value as CustomEvent).detail
    quill.insertText(selection.index, detail?.text)
    quill.formatText(selection.index, (detail?.text.length) ?? 1, { wikilink: detail?.url ?? '' }, Quill.sources.API)
  })

  quill.keyboard.addBinding({ key: 'k', shortKey: true }, addWikiLink)
}
