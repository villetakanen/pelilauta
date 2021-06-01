import Quill from 'quill'

const InlineBlot = Quill.import('blots/inline')

export class MentionBlot extends InlineBlot {
  static blotName = 'mention'
  static className = 'author-mention'
  static tagName = 'span'

  static formats (): boolean {
    return true
  }
}

export class AuthorLinkBlot extends InlineBlot {
  static blotName = 'authorlink'
  static className = 'author-link'
  static tagName = 'a'

  static create (value: string): AuthorLinkBlot {
    const node = super.create()
    // Sanitize url value if desired
    node.setAttribute('href', value)
    // Okay to set other non-format related attributes
    // These are invisible to Parchment so must be static
    node.setAttribute('target', '_blank')
    return node
  }

  static formats (): boolean {
    return true
  }
}
