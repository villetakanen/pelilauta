import Quill from 'quill'

const InlineBlot = Quill.import('blots/inline')

class WikiLinkBlot extends InlineBlot {
  static create (site:unknown, page:unknown) {
    const node = super.create()
    node.setAttribute('page', page)
    node.setAttribute('site', site)
    // This should likely be onClick="window.location.href=..." for routing instead of href attr.
    if (typeof site === 'string' && typeof page === 'string') {
      node.setAttribute('href', `/site/${site}/page/${page}`)
    }
    // Okay to set other non-format related attributes
    // These are invisible to Parchment so must be static
    node.setAttribute('target', '_top')
    return node
  }

  static formats (node:Element) {
    return {
      page: node.getAttribute('page'),
      site: node.getAttribute('site')
    }
  }
}
