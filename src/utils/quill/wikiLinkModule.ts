import Quill from 'quill'
import { logDebug } from '../eventLogger'

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

export const _RTE_WIKILINK_TOOL_EVENT = 'rte-wikilink-tool'

const Module = Quill.import('core/module')

export class WikiLinkModule extends Module {
  private quill:Quill
  private index = 0
  constructor (quill:Quill) {
    super(quill)
    this.quill = quill
    logDebug('WikiLinkModule loaded')
  }

  openWikilinkTool (): boolean {
    if (this.quill.getFormat().wikilink) return false
    this.index = this.quill.getSelection()?.index || 0
    logDebug('openWikilinkTool', this.index)
    document.dispatchEvent(new Event(_RTE_WIKILINK_TOOL_EVENT))
    return true
  }

  addWikilink (link: { url: string, text: string}): void {
    logDebug('addWikilink', this.index)
    this.quill.setSelection(this.index, 0, Quill.sources.SILENT)
    this.quill.insertText(this.index, link.text, Quill.sources.USER)
    this.quill.formatText(this.index, (link.text.length) ?? 1, { wikilink: link.url }, Quill.sources.API)
    this.quill.setSelection(this.index + link.text.length, 0, Quill.sources.SILENT)
  }

  addHandlers (): void {
    this.quill.keyboard.addBinding({ key: 'k', shortKey: true }, () => this.openWikilinkTool())

    const toolbar = this.quill.getModule('toolbar')
    toolbar.addHandler('wikilink', () => this.openWikilinkTool())
  }
}
